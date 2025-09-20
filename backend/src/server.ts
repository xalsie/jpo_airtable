import config from "./config";

import { FastifyApi } from "./api/index";
import { AuthService, InteractionService, ProjectService, UserService } from "./services";

(async () => {
    const authService = new AuthService();
    const interactionService = new InteractionService();
    const projectService = new ProjectService();
    const userService = new UserService();

    const api = new FastifyApi(config.api, {
        auth: authService,
        interaction: interactionService,
        project: projectService,
        user: userService,
    });
    await api.serve();
})();
