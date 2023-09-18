import { appConfigSchema } from 'src/@types/config.types';
import { validateConfig } from '../validator';

export default () =>
  validateConfig('app', appConfigSchema, {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG ? process.env.DEBUG == 'true' : true,
  });
