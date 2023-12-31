import { Property, PropertyType } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findPropertyQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['name', 'type', 'created_at'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  type: z.array(z.nativeEnum(PropertyType)).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Property, QueryableDto>);
export class FindPropertyQueryDto extends createZodDto(
  findPropertyQuerySchema,
) {}
