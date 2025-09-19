import { FastifyPluginAsync } from "fastify";

import { Services } from "../../index";

import AuthController from "./auth.controller";
import InteractionController from "./interaction.controller";
import ProjectController from "./project.controller";
import UserController from "./user.controller";

export default (services: Services): FastifyPluginAsync => async (fastify) => {
    // auth routes (plugin style expecting service)
    fastify.register(AuthController(services.auth), { prefix: "/auth" });
    fastify.register(InteractionController(services.interaction), { prefix: "/interactions" });
    fastify.register(ProjectController(services.project), { prefix: "/projects" });
    fastify.register(UserController(services.user), { prefix: "/user" });

    // fastify.register(async (instance) => {
    //     await ProjectController.register(instance, '/projects');
    // });

    // fastify.register(async (instance) => {
    //     await InteractionController.register(instance, '/interactions');
    // });

    // fastify.register(async (instance) => {
    //     await UserController.register(instance, '/user');
    // });
};
