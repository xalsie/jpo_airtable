import zod from "zod";
import * as dotenv from "dotenv";

import type { StringValue } from "ms";

export enum NodeEnv {
    dev = "development",
    prod = "production",
}

export const EnvSchema = zod.object({
    NODE_ENV: zod.enum(NodeEnv).default(NodeEnv.dev),
    PORT: zod.string().default("3001"),
    AIRTABLE_API_KEY: zod.string(),
    AIRTABLE_BASE_ID: zod.string(),
    FRONTEND_URL: zod.url().default("http://localhost:3000"),
    ALLOWED_ORIGINS: zod.string().default("*"),
    JWT_SECRET: zod.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    JWT_EXPIRATION: zod.custom<StringValue>(
        (val) => typeof val === "string" && val.length > 0,
        { message: "JWT_EXPIRATION must be a valid JWT StringValue" }
    ).default("3h"),
});

export type EnvType = zod.infer<typeof EnvSchema>;

dotenv.config({ quiet: true });

function getEnvVar(key: string, required = true): string {
    const value = process.env[key];
    if (required && (!value || value.trim() === "")) {
        console.error(`[FATAL] Variable d'environnement manquante : ${key}`);
        process.exit(1);
    }
    return value!;
}

const env: EnvType = {
    NODE_ENV: (getEnvVar("NODE_ENV", false) as NodeEnv) || NodeEnv.dev,
    PORT: getEnvVar("PORT", false) || "3001",
    AIRTABLE_API_KEY: getEnvVar("AIRTABLE_API_KEY"),
    AIRTABLE_BASE_ID: getEnvVar("AIRTABLE_BASE_ID"),
    FRONTEND_URL: getEnvVar("FRONTEND_URL", false),
    ALLOWED_ORIGINS: getEnvVar("ALLOWED_ORIGINS", false),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    JWT_EXPIRATION: getEnvVar("JWT_EXPIRATION", false) as StringValue,
};

export { env };
