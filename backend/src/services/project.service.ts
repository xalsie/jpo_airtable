import { Project, TProject } from '../infrastructure/airtable/models';
import Logger from '../utils/logger'

export type IProject = {
    getAll: (params: {
        limit: number,
        offset: number
    }) => Promise<TProject[]>;
    getById: (id: string) => Promise<TProject | null>;
}

export class ProjectService implements IProject {
    async getAll(params: { limit?: number; offset?: number } = {}): Promise<TProject[]> {
        try {
            const projects = await Project.getAll({ fields: Object.values(Project.FieldsIds), ...params });
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
}
