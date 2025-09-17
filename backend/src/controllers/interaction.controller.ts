import { FastifyInstance } from 'fastify';
import { TInteractions } from '../infrastructure/airtable/models';
import { InteractionService } from '../services';
import Logger from '../utils/logger';

export class InteractionController {
    public static async register(server: FastifyInstance, prefix = '/api/interactions') {
        server.get(`${prefix}`, {
            schema: {
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
                const projects: TInteractions[] = await InteractionService.getAll({ limit, offset });

                reply.status(200).send({ projects, limit, offset });
            } catch (err) {
                Logger.error('InteractionController', 'Error fetching projects:', err);
                reply.status(500).send({ message: 'Internal Server Error' });
            }
        });
    }
}

export default InteractionController;
