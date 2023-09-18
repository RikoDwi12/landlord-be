import { databaseConfigSchema } from 'src/@types/config.types';
import { validateConfig } from '../validator';

export default () =>
  validateConfig('database', databaseConfigSchema, {
    url: process.env.DATABASE_URL,
  });
