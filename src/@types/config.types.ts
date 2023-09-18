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

export type appConfig = z.infer<typeof appConfigSchema>;
export type databaseConfig = z.infer<typeof databaseConfigSchema>;
export type authConfig = z.infer<typeof authConfigSchema>;
export type rootConfig = {
  app: appConfig;
  database: databaseConfig;
  auth: authConfig;
};
