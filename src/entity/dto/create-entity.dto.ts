import { Entity, EntityCategory, EntityType } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
import { attachMediaBodySchema } from 'src/media';

export const createEntityBodySchema = attachMediaBodySchema.extend({
  categories: z.array(z.nativeEnum(EntityCategory)),
  type: z.nativeEnum(EntityType),
  name: z.string().min(3),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  nib: z.string().optional().nullable(),
  npwp: z.string().optional().nullable(),
  address: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  city_code: z.string().optional(),
  group_ids: z
    .array(z.number({ coerce: true }))
    .default([])
    .optional(),

  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Entity>);

export class CreateEntityBodyDto extends createZodDto(createEntityBodySchema) { }
