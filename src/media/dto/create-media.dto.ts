import { Media } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { Mediable } from '../media.const';
const createMediaBodySchema = z.object({
  mediable_type: z.nativeEnum(Mediable),
  mediable_id: z.number({ coerce: true }),
} satisfies SchemaDto<Media, QueryableDto>);

export class CreateMediaBodyDto extends createZodDto(createMediaBodySchema) { }
