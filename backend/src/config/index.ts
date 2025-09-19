export * from './env';

import { env } from './env';

const config = {
	api: {
		port: Number(env.PORT) || 3001,
		openapi: env.NODE_ENV !== 'production',
	},
	services: {},
};

export default config;
export * from "./env";
