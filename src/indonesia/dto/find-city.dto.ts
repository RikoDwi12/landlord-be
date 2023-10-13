import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const findCityQuerySchema = z.object({
  province_code: z.string().optional(),
});
export class FindCityQueryDto extends createZodDto(findCityQuerySchema) { }
