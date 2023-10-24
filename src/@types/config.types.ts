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
export const storageConfigSchema = z.object({
  endpoint: z.string(),
  key: z.string(),
  secret: z.string(),
  region: z.string().optional(),
  bucket: z.string(),
  driver: z.enum(['minio', 's3']),
});

export const rootConfigSchema = z.object({
  app: appConfigSchema,
  database: databaseConfigSchema,
  auth: authConfigSchema,
  storage: storageConfigSchema,
});
export type rootConfig = z.infer<typeof rootConfigSchema>;
