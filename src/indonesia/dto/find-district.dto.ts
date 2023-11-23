import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
const findDistrictQuerySchema = z.object({
  city_code: z.string().optional(),
});
export class FindDistrictQueryDto extends createZodDto(
  findDistrictQuerySchema,
) {}
