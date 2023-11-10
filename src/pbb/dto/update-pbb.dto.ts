import { Pbb } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createPbbBodySchema } from './create-pbb.dto';
const updatePbbBodySchema = createPbbBodySchema.extend(
  {} satisfies SchemaDto<Pbb>,
);
export class UpdatePbbBodyDto extends createZodDto(updatePbbBodySchema) { }
