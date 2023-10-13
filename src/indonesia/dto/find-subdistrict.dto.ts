import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const findSubDistrictQuerySchema = z.object({
  district_code: z.string().optional(),
});
export class FindSubDistrictQueryDto extends createZodDto(
  findSubDistrictQuerySchema,
) { }
