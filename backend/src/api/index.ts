import { default as fastify, FastifyInstance } from "fastify";
import swaggerUi from "@fastify/swagger-ui";
import swagger from "@fastify/swagger";

import { configureFastify } from "../infrastructure";

import apiRoutes from "./routes";

import { Logger } from "../utils/logger";

import { IAuth } from "../services/auth.service";
import { IInteraction } from "../services/interaction.service";
import { IProject } from "../services/project.service";
import { IUser } from "../services/user.service";


export type Config = {
    port: number;
    openapi: boolean;
};

export type Services = {
    auth: IAuth;
    interaction: IInteraction;
    project: IProject;
    user: IUser;
};

export class FastifyApi {
    private readonly server: FastifyInstance;

    constructor(
        private readonly config: Config,
        services: Services
    ) {
        this.server = fastify({
            exposeHeadRoutes: false,
        });

        if (config.openapi) {
            this.server.register(swagger as any, {
                openapi: {
                    info: {
                        title: 'JPO Airtable API',
                        version: '1.0.0',
                    },
                    components: {
                        securitySchemes: {
                            bearerAuth: {
                                type: 'http',
                                scheme: 'bearer',
                                bearerFormat: 'JWT'
                            }
                        }
                    },
                    security: []
                }
            });

            this.server.register(swaggerUi as any, {
                routePrefix: '/documentation',
                uiConfig: {
                    persistAuthorization: true
                }
            });
        }

        this.server.get("/health", () => "OK");
        this.server.register(apiRoutes(services));
    }

    async close() {
        return await this.server.close();
    }

    async serve() {
        await configureFastify(this.server);

        await this.server.listen({ port: this.config.port, host: '0.0.0.0' });
        Logger.info('Main', `✅ Server running on http://0.0.0.0:${this.config.port} - Fastify`);

        if (this.config.openapi)
            Logger.info(
                `OpenAPI`,
                `SwaggerUI hosted at http://0.0.0.0:${this.config.port}/documentation`
            );
    }
}
