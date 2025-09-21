import { Project, TProject, Interactions } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'

export type IProject = {
    getAll: (params: {
        limit: number,
        offset: number
    }) => Promise<TProject[]>;
    getById: (id: string) => Promise<TProject | null>;
    updateLikes: (id: string, userId: string, type?: 'like'|'dislike') => Promise<void>;
}

export class ProjectService implements IProject {
    async getAll(params: { limit?: number; offset?: number } = {}): Promise<TProject[]> {
        try {
            const projects: TProject[] = await Project.getAll({ fields: Object.values(Project.FieldsIds), ...params });
            const interactions = await Interactions.getAll({});

            projects.forEach(project => {
                project.activities = interactions.filter(i => i.project?.includes(project.id));
            });

            return projects;
        } catch (error) {
            Logger.error('ProjectService', 'Error fetching projects:', error);
            throw new Error('Failed to fetch projects');
        }
    }

    async getById(id: string): Promise<TProject | null> {
        try {
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
                    type,
                    author: [userId],
                    project: [id],
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                } as any);
            }
        } catch (error) {
            Logger.error('ProjectService', `Error updating likes for project ${id}:`, error);
            throw new Error('Failed to update likes');
        }
    }
}
