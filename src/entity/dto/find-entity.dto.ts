import { Entity, EntityType } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findEntityQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['name', 'email', 'created_at'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  type: z.array(z.string().min(1)).optional(),
  category: z.array(z.string()).optional(),
  group_id: z.array(z.number({ coerce: true })).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Entity, QueryableDto>);
export class FindEntityQueryDto extends createZodDto(findEntityQuerySchema) { }
