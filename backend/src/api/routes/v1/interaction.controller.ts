import { FastifyInstance } from 'fastify';
import { TInteractions } from '../../../infrastructure/airtable/models';
import { InteractionService, IInteraction } from '../../../services/interaction.service';
import Logger from '../../../utils/logger';

export default (service: IInteraction) => async (fastify: FastifyInstance) => {
    fastify.get('/', {
        schema: {
            tags: ['Interactions'],
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
            const projects: TInteractions[] = await service.getAll({ limit, offset });

            reply.status(200).send({ projects, limit, offset });
        } catch (err) {
            Logger.error('InteractionController', 'Error fetching projects:', err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
