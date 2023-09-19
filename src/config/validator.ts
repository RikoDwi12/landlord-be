import { ZodError, ZodSchema } from 'nestjs-zod/z';

export const validateConfig = (
  configName: string,
  schema: ZodSchema,
  data: any,
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
