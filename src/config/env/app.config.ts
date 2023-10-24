import { appConfigSchema } from '../../@types';
import { validateConfig } from '../validator';

export const appConfig = () =>
  validateConfig('app', appConfigSchema, {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG ? process.env.DEBUG == 'true' : true,
  });
