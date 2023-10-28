import { Media } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { Mediable } from '../media.const';
const deleteMediaBodySchema = z.object({
  mediable_type: z.nativeEnum(Mediable),
} satisfies SchemaDto<Media, QueryableDto>);

export class DeleteMediaBodyDto extends createZodDto(deleteMediaBodySchema) { }
