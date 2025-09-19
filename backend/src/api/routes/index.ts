import { FastifyPluginAsync } from "fastify";

import { Services } from "..";

import apiV1 from "./v1";

export default (services: Services): FastifyPluginAsync =>
    async (fastify) => {
        fastify.register(apiV1(services), { prefix: "/v1" });
    };
