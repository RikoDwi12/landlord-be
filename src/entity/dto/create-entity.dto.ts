import { Entity, EntityType } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
import { attachMediaBodySchema } from 'src/media';

export const createEntityBodySchema = attachMediaBodySchema.extend({
  categories: z.array(z.string()),
  type: z.string().min(1),
  name: z.string().min(3),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  nib: z.string().nullish(),
  npwp: z.string().nullish(),
  address: z.string().optional(),
  contact_name: z.string().min(1),
  contact_phone: z.string().min(1),
  city_code: z.string().min(1),
  group_id: z.number({ coerce: true }).nullish(),

  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Entity>);

export class CreateEntityBodyDto extends createZodDto(createEntityBodySchema) {}
