import { ZodError, ZodSchema, z } from 'zod';

export const validateConfig = <T extends ZodSchema>(
  configName: string,
  schema: T,
  data: Record<keyof z.infer<T>, any>,
) => {
  try {
    return { [configName]: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        'Invalid ' +
          configName +
          ' configuration: ' +
          JSON.stringify(error.format(), null, 2),
      );
    }
  }
  return {};
};
