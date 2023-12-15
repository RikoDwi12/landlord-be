import { Role } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
export const findRoleQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(['name', 'created_at'])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Role, QueryableDto>);
export class FindRoleQueryDto extends createZodDto(findRoleQuerySchema) {}
