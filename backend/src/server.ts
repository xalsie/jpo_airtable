import config from "./config";

import { FastifyApi } from "./api/index";
import { AuthService, InteractionService, ProjectService, UserService } from "./services";

(async () => {
    // instantiate services (add more as needed)
    const authService = new AuthService();
    const interactionService = new InteractionService();
    const projectService = new ProjectService();
    const userService = new UserService();

    const api = new FastifyApi(config.api, {
        auth: authService as any,
        interaction: interactionService as any,
        project: projectService as any,
        user: userService as any,
    } as any);
    await api.serve();
})();
