import { Nop } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findNopQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(['id', 'nop', 'created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  taxpayer_id: z.array(z.number({ coerce: true })).optional(),

  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Nop, QueryableDto>);
export class FindNopQueryDto extends createZodDto(findNopQuerySchema) {}
