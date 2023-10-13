import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const findDistrictQuerySchema = z.object({
  city_code: z.string().optional(),
});
export class FindDistrictQueryDto extends createZodDto(
  findDistrictQuerySchema,
) { }
