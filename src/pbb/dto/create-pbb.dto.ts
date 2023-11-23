import { Pbb } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
import { attachMediaBodySchema } from 'src/media';
export const createPbbBodySchema = attachMediaBodySchema.extend({
  year: z.string().length(4),
  nop_id: z.number().int(),
  land_area: z.number({ coerce: true }),
  building_area: z.number({ coerce: true }),
  njop_land: z.number({ coerce: true }),
  njop_building: z.number({ coerce: true }),
  njop_no_tax: z.number({ coerce: true }).optional().default(0),
  taxpayer_id: z.number().int(),
  stimulus: z.number({ coerce: true }).optional().default(0),
  multiplier: z.number({ coerce: true }),
  payment_fee: z.number({ coerce: true }).optional().default(0),
  total_payment: z.number({ coerce: true }).optional(),
  payment_method: z.string().optional(),
  payment_date: z.date({ coerce: true }).optional(),
  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Pbb>);
export class CreatePbbBodyDto extends createZodDto(createPbbBodySchema) {}
