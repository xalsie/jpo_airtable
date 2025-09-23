import { FastifyInstance } from 'fastify';
import { TProject } from '../../../infrastructure/airtable/models';
import { IProject } from '../../../services/project.service';
import Logger from '../../../utils/logger';

import { authenticate } from '../../../utils/authenticate';

export default (service: IProject) => async (fastify: FastifyInstance) => {
    fastify.get('/', {
        schema: {
            tags: ['Projects'],
            querystring: {
                type: 'object',
                properties: {
                    limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
                    offset: { type: 'number', minimum: 0, default: 0 },
                    page: { type: 'number', minimum: 1, default: 1 }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { limit = 20, offset, page = 1 } = request.query as { limit?: number; offset?: number; page?: number };

            const computedOffset = (typeof offset === 'number' && offset > 0) ? offset : (page - 1) * limit;

            const result = await service.getAll({ limit, offset: computedOffset });

            const { projects, total } = result as { projects: TProject[]; total: number };

            const totalPages = Math.ceil(total / limit);

            reply.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

            reply.status(200).send({
                projects,
                meta: { total, page, limit, offset: computedOffset, totalPages }
            });
        } catch (err) {
            Logger.error('ProjectController', 'Error fetching projects:', err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    fastify.post('/:id/like', {
        schema: {
            tags: ['Projects'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            }
        },
        preHandler: [authenticate]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const project = await service.getById(id);
            if (!project) {
                reply.status(404).send({ message: 'Project not found' });
                return;
            }

            const userId = (request as any).user?.userId;

            const updatedProject = await service.updateLikes(id, userId, 'like');
            reply.status(200).send(updatedProject);
        } catch (err) {
            Logger.error('ProjectController', `Error liking project with id ${id}:`, err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    fastify.post('/:id/dislike', {
        schema: {
            tags: ['Projects'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' }
                },
                required: ['id']
            }
        },
        preHandler: [authenticate]
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const project = await service.getById(id);
            if (!project) {
                reply.status(404).send({ message: 'Project not found' });
                return;
            }

            const userId = (request as any).user?.userId;
            const updatedProject = await service.updateLikes(id, userId, 'dislike');
            reply.status(200).send(updatedProject);
        } catch (err) {
            Logger.error('ProjectController', `Error disliking project with id ${id}:`, err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    fastify.get('/:id', {
        schema: {
            tags: ['Projects'],
            params: {
                type: 'object',
                properties: { id: { type: 'string' } },
                required: ['id']
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const project = await service.getById(id);
            if (!project) {
                reply.status(404).send({ message: 'Project not found' });
                return;
            }
            reply.status(200).send(project);
        } catch (err) {
            Logger.error('ProjectController', `Error fetching project with id ${id}:`, err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
