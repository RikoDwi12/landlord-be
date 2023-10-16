import { Entity, EntityCategory, EntityType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from 'src/@types/dto.types';
export const createEntityBodySchema = z.object({
  categories: z.array(z.nativeEnum(EntityCategory)),
  type: z.nativeEnum(EntityType),
  name: z.string().nonempty(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  nib: z.string().optional().nullable(),
  npwp: z.string().optional().nullable(),
  address: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  city_code: z.string().optional(),

  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Entity>);
export class CreateEntityBodyDto extends createZodDto(createEntityBodySchema) { }
