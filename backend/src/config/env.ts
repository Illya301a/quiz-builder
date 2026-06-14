import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_PATH: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
