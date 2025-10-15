import { Project, TProject, Interactions } from '../infrastructure/airtable/models';
import Redis from '../infrastructure/redis/redis'
import Logger from '../utils/logger'

export type IProject = {
    getAll: (params?: {
        limit?: number,
        offset?: number,
        maxRecords?: number,
        pageSize?: number
    }) => Promise<{ projects: TProject[]; total: number }>;
    getById: (id: string) => Promise<TProject | null>;
    updateLikes: (id: string, userId: string, type?: 'like'|'dislike') => Promise<void>;
}

export class ProjectService implements IProject {
    async getAll({ limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}): Promise<{ projects: TProject[]; total: number }> {
        try {
            const page = Math.floor(offset / limit) + 1;
            const cacheKey = `projects:page:${page}:limit:${limit}`;
            const fullListKey = `projects:all`;

            const cachedPage = await Redis.getInstance().get(cacheKey);
            if (cachedPage) {
                Logger.info('ProjectService', `Cache hit for page key ${cacheKey}`);
                const parsed = JSON.parse(cachedPage) as { projects: TProject[]; total: number };
                Logger.info('ProjectService', `Returning ${parsed.projects?.length || 0} projects from page cache (total ${parsed.total})`);
                return parsed;
            }

            const cachedAll = await Redis.getInstance().get(fullListKey);
            if (cachedAll) {
                const allProjects: TProject[] = JSON.parse(cachedAll);
                const total = allProjects.length;
                const projects = allProjects.slice(offset, offset + limit);
                const payload = { projects, total };

                await Redis.getInstance().set(cacheKey, JSON.stringify(payload), 'EX', 60);
                Logger.info('ProjectService', `Used full-list cache ${fullListKey}, returning slice offset=${offset} limit=${limit} -> ${projects.length} items (total ${total})`);

                return payload;
            }

            const all = await Project.getAll({ /* optional: fields: ['id','name','activities','...'], pageSize: 100 */ });
            const total = all.length;

            Logger.info('ProjectService', `Fetched ${total} projects from Airtable (no cache). Slicing offset=${offset} limit=${limit}`);
            await Redis.getInstance().set(fullListKey, JSON.stringify(all), 'EX', 300);
            const projects = all.slice(offset, offset + limit);
            const payload = { projects, total };
            await Redis.getInstance().set(cacheKey, JSON.stringify(payload), 'EX', 60);

            Logger.info('ProjectService', `Returning ${projects.length} projects for page (total ${total})`);

            return payload;
        } catch (error) {
            Logger.error('ProjectService', 'Error in getAll:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<TProject | null> {
        try {
            const fullListKey = `projects:all`;
            try {
                const cachedAll = await Redis.getInstance().get(fullListKey);
                if (cachedAll) {
                    const allProjects: TProject[] = JSON.parse(cachedAll);
                    const found = allProjects.find(p => p.id === id) || null;
                    if (found) {
                        Logger.info('ProjectService', `Found project ${id} in full-list cache`);
                        return found;
                    }
                    Logger.info('ProjectService', `Project ${id} not found in full-list cache, falling back to Airtable`);
                }
            } catch (cacheErr) {
                Logger.error('ProjectService', `Failed to read from cache for getById ${id}:`, cacheErr);
            }

            const project = await Project.getById(id);
            return project;
        } catch (error) {
            Logger.error('ProjectService', `Error fetching project with id ${id}:`, error);
            throw new Error('Failed to fetch project');
        }
    }

    async updateLikes(id: string, userId: string, type?: 'like'|'dislike'): Promise<void> {
        try {
            const interactions = await Interactions.getAll({});
            const existingSameType = interactions.find((i: any) => i.author?.includes(userId) && i.project?.includes(id) && i.type === type) as (any | undefined);

            if (existingSameType) {
                await Interactions.delete(existingSameType.id);
                return;
            }

            const oppositeType = type === 'like' ? 'dislike' : type === 'dislike' ? 'like' : undefined;
            if (oppositeType) {
                const oppositeInteractions = interactions.filter((i: any) => i.author?.includes(userId) && i.project?.includes(id) && i.type === oppositeType);
                for (const opp of oppositeInteractions) {
                    await Interactions.delete(opp.id);
                }
            }

            if (userId && type) {
                await Interactions.create({
                    [Interactions.FieldsIds.type]: type,
                    [Interactions.FieldsIds.author]: [userId],
                    [Interactions.FieldsIds.project]: [id],
                    [Interactions.FieldsIds.created]: new Date().toISOString(),
                    [Interactions.FieldsIds.updated]: new Date().toISOString(),
                } as any);
            }
        } catch (error) {
            Logger.error('ProjectService', `Error updating likes for project ${id}:`, error);
            throw new Error('Failed to update likes');
        }
    }
}
