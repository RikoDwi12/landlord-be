import { Media } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from '../../@types/dto.types';
import { MediableType } from '../media.enum';
const createMediaBodySchema = z.object({
  type: z.nativeEnum(MediableType),
} satisfies SchemaDto<Media>);
export class CreateMediaBodyDto extends createZodDto(createMediaBodySchema) { }
