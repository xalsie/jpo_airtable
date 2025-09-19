export * from './env';

import { env } from './env';

const config = {
	api: {
		port: Number(env.PORT) || 3001,
		openapi: env.NODE_ENV !== 'production',
	},
	// placeholder for other service configs if needed in the future
	services: {},
};

export default config;
export * from "./env";
