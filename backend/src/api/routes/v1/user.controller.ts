import { FastifyInstance } from 'fastify';
import { TUser } from '../../../infrastructure/airtable/models';
import { IUser } from '../../../services/user.service';
import Logger from '../../../utils/logger';

import { authenticate } from '../../../utils/authenticate';

export default (service: IUser) => async (fastify: FastifyInstance) => {
    fastify.decorate('authenticate', authenticate);

    fastify.get(`/me`, {
        preHandler: authenticate
    }, async (request, reply) => {
        try {
            const userId = (request as any).user.userId;
            const result = await service.me ? await service.me(userId) : null;
            if (!result || (result as any).error) {
                reply.status(404).send({ message: (result as any)?.error || 'Utilisateur non trouvé' })
                return;
            }
            reply.send(result);
        } catch (error) {
            Logger.error('AuthController', 'Error during fetching user info:', error)
            reply.status(500).send({ message: 'Internal server error' })
        }
    });

    fastify.patch(`/me`, {
        preHandler: authenticate,
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    avatar: { type: 'string' },
                    school: { type: 'string' },
                    promo: { type: 'string' },
                    telephone: { type: 'string' },
                    isContacted: { type: 'boolean' }
                },
                additionalProperties: true
            }
        }
    }, async (request, reply) => {
        try {
            const userId = (request as any).user.userId;
            const data = request.body as Partial<TUser>;
            const result = await service.update(userId, data);
            if (!result || (result as any).error) {
                reply.status(400).send({ message: (result as any)?.error || 'Erreur lors de la mise à jour' });
                return;
            }
            reply.send(result);
        } catch (error) {
            Logger.error('UserController', 'Error during update user info:', error);
            reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
