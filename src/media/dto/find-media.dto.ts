import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Mediable } from '../media.const';
const findMediaQuerySchema = z.object({
  mediable_type: z.nativeEnum(Mediable).optional(),
  mediable_id: z.number({ coerce: true }).optional(),
});
export class FindMediaQueryDto extends createZodDto(findMediaQuerySchema) { }
