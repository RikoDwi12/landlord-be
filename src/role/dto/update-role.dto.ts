import { Role } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createRoleBodySchema } from './create-role.dto';
const updateRoleBodySchema = createRoleBodySchema.extend(
  {} satisfies SchemaDto<Role>,
);
export class UpdateRoleBodyDto extends createZodDto(updateRoleBodySchema) { }
