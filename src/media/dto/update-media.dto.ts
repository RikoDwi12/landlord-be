import { Media } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const renameMediaBodySchema = z.object({
  id: z.number({ coerce: true }),
  title: z.string().min(1),
} satisfies SchemaDto<Media, QueryableDto>);

export class RenameMediaBodyDto extends createZodDto(renameMediaBodySchema) {}
