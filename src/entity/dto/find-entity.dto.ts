import { EntityCategory, EntityType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
const findEntityQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['name', 'email', 'created_at'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  type: z.array(z.nativeEnum(EntityType)).optional(),
  categories: z.array(z.nativeEnum(EntityCategory)).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
});
export class FindEntityQueryDto extends createZodDto(findEntityQuerySchema) { }