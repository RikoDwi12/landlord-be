import { Group } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findGroupQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(['name', 'created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  id: z.array(z.number({ coerce: true })).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Group, QueryableDto>);
export class FindGroupQueryDto extends createZodDto(findGroupQuerySchema) { }
