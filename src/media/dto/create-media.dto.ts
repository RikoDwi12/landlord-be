import { Media, MediaTag } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { Mediable } from '../media.const';
const createMediaBodySchema = z.object({
  mediable_type: z.nativeEnum(Mediable),
  mediable_id: z.number({ coerce: true }),
  tags: z.array(z.nativeEnum(MediaTag)),
} satisfies SchemaDto<Media, QueryableDto>);

export class CreateMediaBodyDto extends createZodDto(createMediaBodySchema) {}

// ini digunakan di module yang punya media attachments
// tinggal di extends
export const attachMediaBodySchema = z.object({
  attachments: z.array(
    z.object({ id: z.union([z.number({ coerce: true }), z.string()]) }),
  ),
});
