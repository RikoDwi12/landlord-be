import { authConfigSchema } from '../../@types';
import { validateConfig } from '../validator';

export const authConfig = () =>
  validateConfig('auth', authConfigSchema, {
    jwtSecret: process.env.JWT_SECRET,
  });
