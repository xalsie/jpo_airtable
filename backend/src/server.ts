import { configureFastify } from "./infrastructure";
import fastify from 'fastify';
import Logger from './utils/logger'
import { env, EnvSchema } from "./config/env";
import {
    AuthController,
} from "./controllers";

const [envValid, envErrors] = (() => {
    try {
        EnvSchema.parse(env);
        return [true, null];
    } catch (e: any) {
        return [false, e];
    }
})();

if (!envValid) {
    console.error("[FATAL] Erreur de validation des variables d'environnement :", envErrors);
    process.exit(1);
}

const startServer = async () => {
    const server = fastify({ logger: true });

    await configureFastify(server);

    return { server };
};

startServer().then(async ({ server }) => {
    try {
        const controllers: any[] = [
            AuthController
        ];

        for (const Controller of controllers) {
            if (!Controller) continue;
            try {
                if (typeof Controller.register === 'function') {
                    Logger.info('Main', `Registering controller ${Controller.name}...`);
                    await Controller.register(server);
                    continue;
                }
                Logger.warn('Main', `Controller ${Controller?.name || 'unknown'} had no register method; skipped.`);
            } catch (err) {
                Logger.error('Main', `Failed to register controller ${Controller?.name || 'unknown'}:`, err);
                throw err;
            }
        }

        const PORT = Number(env.PORT);
        await server.listen({ port: PORT, host: '0.0.0.0' });
        Logger.info('Main', `✅ Server running on http://0.0.0.0:${PORT} - Fastify`);
    } catch (err) {
        Logger.error('Main', 'Failed to start server:', err);
        process.exit(1);
    }
}).catch((err) => {
    Logger.error('Main', 'Failed to start server infrastructure:', err);
    process.exit(1);
});
