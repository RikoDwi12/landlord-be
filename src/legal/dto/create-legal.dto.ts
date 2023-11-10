import { Legal, LegalPartyType, LegalType } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '../../@types/dto.types';
import { attachMediaBodySchema } from 'src/media';

export const createLegalBodySchema = attachMediaBodySchema.extend({
  type: z.nativeEnum(LegalType),
  no: z.string(),
  date: z.date({ coerce: true }),
  title: z.string(),
  detail: z.string().optional(),
  notary_id: z.number({ coerce: true }).optional(),
  storage_cabinet: z.string().optional(),
  storage_rax: z.string().optional(),
  storage_row: z.string().optional(),
  storage_map: z.string().optional(),
  legalization_no: z.string().optional(),
  legalization_date: z.date({ coerce: true }).optional(),

  // pihak yang terlibat di akta legal
  // ambil dari entity
  parties: z
    .array(
      z.object({
        entity_id: z.number({ coerce: true }),
        type: z.nativeEnum(LegalPartyType).optional(),
      }),
    )
    .optional(),

  // saksi yang terlibat di akta legal
  // ambil dari entity
  witnesses: z
    .array(
      z.object({
        entity_id: z.number({ coerce: true }),
      }),
    )
    .optional(),
} satisfies SchemaDto<Legal>);

export class CreateLegalBodyDto extends createZodDto(createLegalBodySchema) { }
