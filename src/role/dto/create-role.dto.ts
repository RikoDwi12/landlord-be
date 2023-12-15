import { Role } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
import { PERMISSIONS } from '../permission.const';
export const createRoleBodySchema = z.object({
  name: z.string().min(1),
  permissions: z.array(z.enum(PERMISSIONS)).transform((v) => v as string[]).optional()
} satisfies SchemaDto<Role>);
export class CreateRoleBodyDto extends createZodDto(createRoleBodySchema) {}
