import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
const findCityQuerySchema = z.object({
  province_code: z.string().optional(),
});
export class FindCityQueryDto extends createZodDto(findCityQuerySchema) {}
