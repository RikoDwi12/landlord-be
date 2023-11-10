import { Entity } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createEntityBodySchema } from './create-entity.dto';
const updateEntityBodySchema = createEntityBodySchema.extend({
  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Entity>);
export class UpdateEntityBodyDto extends createZodDto(updateEntityBodySchema) { }
