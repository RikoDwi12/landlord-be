import { Media } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { Mediable } from '../media.const';
const deleteMediaBodySchema = z.object({
  mediable_type: z.nativeEnum(Mediable),
} satisfies SchemaDto<Media, QueryableDto>);

export class DeleteMediaBodyDto extends createZodDto(deleteMediaBodySchema) {}
