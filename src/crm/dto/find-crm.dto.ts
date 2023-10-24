import { Crm } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findCrmQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(['created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Crm, QueryableDto>);
export class FindCrmQueryDto extends createZodDto(findCrmQuerySchema) { }
