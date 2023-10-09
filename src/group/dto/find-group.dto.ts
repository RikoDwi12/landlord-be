import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const findGroupQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(['name', 'created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  ids: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(',').map((v) => +v) : undefined)),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
});
export class FindGroupQueryDto extends createZodDto(findGroupQuerySchema) { }
