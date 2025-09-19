import { User, TUser } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'

export type IUser = {
    me: (userId: string) => Promise<TUser | { error: string }>;
    update: (userId: string, data: Partial<TUser>) => Promise<TUser | { error: string }>;
}

export class UserService implements IUser {
    async me(userId: string): Promise<TUser | { error: string }> {
        try {
            const user = await User.getById(userId) as TUser | null;
            if (!user) {
                return { error: 'Utilisateur non trouvé' };
            }
            return {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
                school: user.school,
                promo: user.promo,
                telephone: user.telephone,
                isContacted: user.isContacted
            } as TUser;
        } catch (error) {
            Logger.error('AuthService', 'Error in me:', error);
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

            const updated = await User.update(userId, updateData);
            if (!updated) {
                return { error: 'Utilisateur non trouvé ou non modifié' };
            }
            return updated;
        } catch (error) {
            Logger.error('UserService', 'Error in update:', error);
            return { error: 'Erreur lors de la mise à jour de l\'utilisateur' };
        }
    }
}
