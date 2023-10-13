import { Property, PropertyType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from 'src/@types/dto.types';
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
export class FindPropertyQueryDto extends createZodDto(findPropertyQuerySchema) { }
