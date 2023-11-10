import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
const findSubDistrictQuerySchema = z.object({
  district_code: z.string().optional(),
});
export class FindSubDistrictQueryDto extends createZodDto(
  findSubDistrictQuerySchema,
) { }
