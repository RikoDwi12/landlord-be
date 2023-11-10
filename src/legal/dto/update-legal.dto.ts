import { Legal } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createLegalBodySchema } from './create-legal.dto';

export const updateLegalBodySchema = createLegalBodySchema.extend(
  {} satisfies SchemaDto<Legal>,
);

export class updateLegalBodyDto extends createZodDto(updateLegalBodySchema) { }
