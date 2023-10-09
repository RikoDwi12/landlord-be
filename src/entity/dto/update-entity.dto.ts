import { Entity, EntityCategory, EntityType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from 'src/@types/dto.types';
const updateEntityBodySchema = z.object({
  categories: z.array(z.nativeEnum(EntityCategory)).optional(),
  type: z.nativeEnum(EntityType).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  nib: z.string().optional(),
  npwp: z.string().optional(),
  address: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  city_code: z.string().optional(),

  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Entity>);
export class UpdateEntityBodyDto extends createZodDto(updateEntityBodySchema) { }
