import { storageConfigSchema } from '../../@types';
import { validateConfig } from '../validator';

export const storageConfig = () =>
  validateConfig('storage', storageConfigSchema, {
    key: process.env.STORAGE_ACCESS_KEY,
    secret: process.env.STORAGE_SECRET_KEY,
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET,
    driver: process.env.STORAGE_DRIVER,
    endpoint: process.env.STORAGE_ENDPOINT,
    tmpPath: process.env.STORAGE_TMP_PATH,
  });
