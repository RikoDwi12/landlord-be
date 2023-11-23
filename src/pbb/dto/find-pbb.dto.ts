import { Pbb } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findPbbQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['nop_id', 'year', 'created_at'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  year: z.array(z.string().length(4)).optional(),
  nop_id: z.array(z.number({ coerce: true }).int()).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Pbb, QueryableDto>);
export class FindPbbQueryDto extends createZodDto(findPbbQuerySchema) {}
