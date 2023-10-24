import { Media } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { MediableType } from '../media.enum';
const findMediaQuerySchema = z.object({
  type: z.nativeEnum(MediableType),
  search: z.string().optional(),
  orderBy: z.enum(['created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Media, QueryableDto>);
export class FindMediaQueryDto extends createZodDto(findMediaQuerySchema) { }
