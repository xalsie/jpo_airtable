import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyRateLimit from '@fastify/rate-limit';
import { env } from '../../../config';
import Logger from '../../../utils/logger';

import fastifyCaching from '@fastify/caching'
import fastifyRedis from '@fastify/redis'
// @ts-ignore
import abstractCache from 'abstract-cache'
import IORedis from 'ioredis'

const redis = new IORedis({
	host: env.REDIS_HOST,
})

const client = abstractCache({
	driver: {
		name: 'abstract-cache-redis',
		options: {
			client: redis
		}
	}
})

export const configureFastify = async (app: FastifyInstance) => {
    await app.register(fastifyHelmet);

    await app.register(fastifyCors, {
        origin: (origin: string | undefined, cb: any) => {
            if (!origin) return cb(null, true);
            const allowedOrigins = env.ALLOWED_ORIGINS;
            const origins = allowedOrigins.split(' ');
            if (allowedOrigins === '*' || origins.indexOf(origin) !== -1) {
                cb(null, true);
            } else {
                cb(new Error('Request from unauthorized origin'));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    });

    try {
        await app.register(fastifyCompress, { global: true });
    } catch (err) {
        Logger.error('FastifyHooks', 'Failed to register compress plugin', err);
    }

    await app.register(fastifyRateLimit, {
        max: 50,
        timeWindow: '1 minute',
    });

    try {
        app.register(fastifyRedis, { client: redis })
        app.register(fastifyCaching, { cache: client })
    } catch (err) {
        Logger.error('FastifyHooks', 'Failed to register caching plugin', err);
    }

    app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.info('FastifyHooks', `onSend hook - reqId=${rid} status=${reply.statusCode} payloadLength=${payload?.length ?? 'unknown'}`);
        } catch (e) {
            Logger.error('FastifyHooks', 'onSend hook error', e);
        }
        try {
            if (request.method === 'GET' && !reply.getHeader('cache-control')) {
                reply.header('Cache-Control', 'public, max-age=300, s-maxage=300');
            }
        } catch (e) {
            Logger.error('FastifyHooks', 'onSend cache header error', e);
        }
        return payload;
    });

    app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.info('FastifyHooks', `onResponse hook - reqId=${rid} status=${reply.statusCode}`);
        } catch (e) {
            Logger.error('FastifyHooks', 'onResponse hook error', e);
        }
    });

    app.setErrorHandler((error, request, reply) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.error('FastifyHooks', `setErrorHandler - reqId=${rid} status=${reply.statusCode} error=`, error);
        } catch (e) {
            Logger.error('FastifyHooks', 'setErrorHandler internal error', e);
        }
        (reply as any).send(error);
    });

    Logger.info('FastifyHooks', '- Fastify infrastructure configured');
};

export default configureFastify;
