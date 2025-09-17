import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyRateLimit from '@fastify/rate-limit';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../../config';
import Logger from '../../../utils/logger';

export const configureFastify = async (app: FastifyInstance) => {
    await app.register(fastifyHelmet as any);

    await app.register(fastifyCors as any, {
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
    });

    // Register compression plugin (wrap in try/catch to log potential plugin errors)
    try {
        await app.register(fastifyCompress as any, { global: true });
    } catch (err) {
        Logger.error('FastifyHooks', 'Failed to register compress plugin', err as any);
    }

    await app.register(fastifyRateLimit as any, {
        max: 50,
        timeWindow: '1 minute',
    });

    // Diagnostic hooks to trace reply lifecycle and potential premature close
    app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.info('FastifyHooks', `onSend hook - reqId=${rid} status=${reply.statusCode} payloadLength=${payload?.length ?? 'unknown'}`);
        } catch (e) {
            Logger.error('FastifyHooks', 'onSend hook error', e as any);
        }
        return payload;
    });

    app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.info('FastifyHooks', `onResponse hook - reqId=${rid} status=${reply.statusCode}`);
        } catch (e) {
            Logger.error('FastifyHooks', 'onResponse hook error', e as any);
        }
    });

    app.setErrorHandler((error, request, reply) => {
        try {
            const rid = (request as any).id || (request as any).reqId || 'unknown';
            Logger.error('FastifyHooks', `setErrorHandler - reqId=${rid} status=${reply.statusCode} error=`, error as any);
        } catch (e) {
            Logger.error('FastifyHooks', 'setErrorHandler internal error', e as any);
        }
        // default behaviour
        (reply as any).send(error);
    });

    Logger.info('FastifyHooks', '- Fastify infrastructure configured');
};

export default configureFastify;
