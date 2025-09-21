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
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { limit = 20, offset = 0 } = request.query as { limit?: number; offset?: number };
            const projects: TProject[] = await service.getAll({ limit, offset });

            reply.status(200).send({ projects, limit, offset });
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
}
