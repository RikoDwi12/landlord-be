import { z } from 'nestjs-zod/z';

export const appConfigSchema = z.object({
  port: z.number({ coerce: true }),
  debug: z.boolean(),
});

export const databaseConfigSchema = z.object({
  url: z.string(),
});
export const authConfigSchema = z.object({
  jwtSecret: z.string(),
});

export const rootConfigSchema = z.object({
  app: appConfigSchema,
  database: databaseConfigSchema,
  auth: authConfigSchema,
});
export type rootConfig = z.infer<typeof rootConfigSchema>;
