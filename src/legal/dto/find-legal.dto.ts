import { Legal } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findLegalQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum([
      'created_at',
      'title',
      'no',
      'date',
      'legalization_no',
      'legalization_date',
    ])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable

  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Legal, QueryableDto>);
export class FindLegalQueryDto extends createZodDto(findLegalQuerySchema) { }
