import { authConfigSchema } from 'src/@types/config.types';
import { validateConfig } from '../validator';

export default () =>
  validateConfig('auth', authConfigSchema, {
    jwtSecret: process.env.JWT_SECRET,
  });
