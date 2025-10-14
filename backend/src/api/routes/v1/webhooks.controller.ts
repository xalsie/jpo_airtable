import { FastifyInstance } from 'fastify';
import Logger from '../../../utils/logger';

import { IWebhook } from '../../../services/webhook.service';

export default (service: IWebhook) => async (fastify: FastifyInstance) => {
    // disable caching for all routes in this controller
    fastify.addHook('preHandler', async (request, reply) => {
        reply
            .header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            .header('Pragma', 'no-cache')
            .header('Expires', '0');
        });

    fastify.get('/airtable', {
        schema: {
            tags: ['Webhooks'],
            querystring: {
                type: 'object',
                properties: {
                    secret: { type: 'string', default: '' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { secret } = request.query as { secret?: string };
            if (secret !== process.env.WEBHOOK_AIRTABLE_SECRET) {
                reply.status(403).send({ message: 'Forbidden' });
                return;
            }
            await service.resetCache();

            reply.status(200).send({ message: 'Webhook reset successfully' });
        } catch (err) {
            Logger.error('WebhookController', 'Error resetting webhook:', err);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
