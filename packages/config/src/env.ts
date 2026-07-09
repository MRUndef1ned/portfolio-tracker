import { config as loadDotenv } from "dotenv";
import { z } from "zod";
import {
  DEFAULT_API_HOST,
  DEFAULT_API_PORT,
  DEFAULT_DB_PATH,
  DEFAULT_NODE_ENV,
  DEFAULT_WEB_PORT
} from "./constants";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default(DEFAULT_NODE_ENV),
  WEB_PORT: z.coerce.number().int().positive().default(DEFAULT_WEB_PORT),
  API_PORT: z.coerce.number().int().positive().default(DEFAULT_API_PORT),
  API_HOST: z.string().min(1).default(DEFAULT_API_HOST),
  DB_PATH: z.string().min(1).default(DEFAULT_DB_PATH),
  VITE_API_BASE_URL: z.string().url().optional()
});

export type AppConfig = z.infer<typeof envSchema>;

let cachedConfig: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  loadDotenv();
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }

  cachedConfig = parsed.data;
  return cachedConfig;
}

export function clearConfigCache(): void {
  cachedConfig = null;
}
