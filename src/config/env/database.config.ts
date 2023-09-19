import { databaseConfigSchema } from 'src/@types';
import { validateConfig } from '../validator';

export const databaseConfig = () =>
  validateConfig('database', databaseConfigSchema, {
    url: process.env.DATABASE_URL,
  });
