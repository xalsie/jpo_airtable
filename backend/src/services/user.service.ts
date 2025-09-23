import { User, TUser } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'
import Redis from '../infrastructure/redis/redis';
import { getQueue } from '../infrastructure/queue/bullmq';

export type IUser = {
    me: (userId: string) => Promise<TUser | { error: string }>;
    update: (userId: string, data: Partial<TUser>) => Promise<TUser | { error: string }>;
}

export class UserService implements IUser {
    async me(userId: string): Promise<TUser | { error: string }> {
        try {
            const key = `user:${userId}`;
            const cached = await Redis.getInstance().get(key);
            if (cached) {
                return JSON.parse(cached) as TUser;
            }

            const user = await User.getById(userId) as TUser | null;
            if (!user) {
                return { error: 'Utilisateur non trouvé' };
            }

            // cache for 5 minutes
            await Redis.getInstance().set(key, JSON.stringify(user), 'EX', 300);
            return user;
        } catch (error) {
            Logger.error('UserService', 'Error in me:', error);
            return { error: 'Erreur lors de la récupération de l\'utilisateur' };
        }
    }

    async update(userId: string, data: Partial<TUser>): Promise<TUser | { error: string }> {
        try {
            const fieldIdMap: Record<string, string> = User.FieldsIds;

            const updateData: Record<string, any> = {};
            (Object.keys(data) as Array<keyof TUser>).forEach((key) => {
                if (
                    key !== 'id' &&
                    data[key] !== undefined &&
                    data[key] !== null &&
                    fieldIdMap[key as string]
                ) {
                    updateData[fieldIdMap[key as string]] = data[key];
                }
            });

            if (Object.keys(updateData).length === 0) {
                return { error: 'Aucun champ valide à mettre à jour' };
            }

            const cacheKey = `user:${userId}`;
            // Optimistically update cache for fast response
            const cached = await Redis.getInstance().get(cacheKey);
            const current = cached ? JSON.parse(cached) as Partial<TUser> : {};
            const optimistic = { ...(current as object), ...(data as object), id: userId } as TUser;
            await Redis.getInstance().set(cacheKey, JSON.stringify(optimistic), 'EX', 3600);

            // Push job to BullMQ queue for background sync to Airtable
            const queue = getQueue();
            try {
                Logger.info('UserService', `Enqueue syncUser job for user ${userId}`);
                await queue.add('syncUser', { userId, updateData }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });
                Logger.info('UserService', `Enqueued syncUser job for user ${userId}`);
            } catch (qerr) {
                // Don't fail the whole request if enqueueing fails; log for investigation
                Logger.error('UserService', `Failed to enqueue syncUser job for user ${userId}`, qerr);
            }

            // Return optimistic response
            return optimistic;
        } catch (error) {
            Logger.error('UserService', 'Error in update:', error);
            return { error: 'Erreur lors de la mise à jour de l\'utilisateur' };
        }
    }
}
