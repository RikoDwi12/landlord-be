import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Mediable } from '../media.const';
import { MediaTag } from '@prisma/client';
const findMediaQuerySchema = z.object({
  mediable_type: z.nativeEnum(Mediable).optional(),
  mediable_id: z.number({ coerce: true }).optional(),
  tags: z.array(z.nativeEnum(MediaTag)),
});
export class FindMediaQueryDto extends createZodDto(findMediaQuerySchema) {}
