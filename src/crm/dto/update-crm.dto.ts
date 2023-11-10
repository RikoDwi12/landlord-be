import { Crm } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
const updateCrmBodySchema = z.object({
	property_id: z.number({ coerce: true }).int(),
	date: z.date({ coerce: true }),
	prospect_client_id: z.number({ coerce: true }).int().optional(),
	prospect_desc: z.string(),
	pic_client_id: z.number({ coerce: true }).int().optional(),
	// agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Crm>);
export class UpdateCrmBodyDto extends createZodDto(updateCrmBodySchema) { }
