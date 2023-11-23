import { Group } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
export const findGroupQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['name', 'created_at', 'entities._count'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  id: z.array(z.number({ coerce: true })).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Group, QueryableDto>);
export class FindGroupQueryDto extends createZodDto(findGroupQuerySchema) { }
