import { Nop } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
const createNopBodySchema = z.object({
  nop: z.string().nonempty(),
  location: z.string().nonempty().optional(),
  land_area: z.number({ coerce: true }).optional(),
  taxpayer_id: z.number({ coerce: true }).int().optional(),
  building_area: z.number({ coerce: true }).optional(),
  subdistrict_code: z.string().optional(),
  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Nop>);
export class CreateNopBodyDto extends createZodDto(createNopBodySchema) {}
