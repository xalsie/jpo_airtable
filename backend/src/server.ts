import config from "./config";

import { FastifyApi } from "./api/index";
import { AuthService, InteractionService, ProjectService, UserService, WebhookService } from "./services";
import { startProjectCacheWorker } from './workers/projectCacheWorker';

(async () => {
    const authService = new AuthService();
    const interactionService = new InteractionService();
    const projectService = new ProjectService();
    const userService = new UserService();
    const webhookService = new WebhookService();

    const api = new FastifyApi(config.api, {
        auth: authService,
        interaction: interactionService,
        project: projectService,
        user: userService,
        webhook: webhookService
    });
    await api.serve();

    startProjectCacheWorker({ intervalMs: 1000 * 60 * 10, ttlSeconds: 300 });
})();
