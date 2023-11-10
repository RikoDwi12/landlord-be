import { Property } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createPropertyBodySchema } from './create-property.dto';
const updatePropertyBodySchema = createPropertyBodySchema.extend(
	{} satisfies SchemaDto<Property>,
);
export class UpdatePropertyBodyDto extends createZodDto(
	updatePropertyBodySchema,
) { }
