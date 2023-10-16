import { Certificate, CertificateStatus, CertificateType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from 'src/@types/dto.types';
const createCertificateBodySchema = z.object({
  property_id: z.number({coerce: true}).int().optional(),
  behalf_of_id: z.number({coerce: true}).int(),
  group_id: z.number({coerce: true}).int().optional(),
  type: z.nativeEnum(CertificateType),
  no: z.string(),
  subdistrict_code: z.string().optional(),
  address: z.string().optional(),
  location_name: z.string().optional(),
  original_cert: z.string().optional(),
  original_doc: z.string().optional(),
  copy_archive: z.string().optional(),
  no_copy_archive: z.string().optional(),
  ownership_status: z.nativeEnum(CertificateStatus).optional(),
  owner_id: z.number({coerce: true}).int().optional(),
  functional: z.string().optional(),
  land_area: z.number({coerce: true}).int(),
  ajb_notary_id: z.number({coerce: true}).int(),
  ajb_no: z.string(),
  ajb_date: z.date({coerce: true}),
  ajb_total: z.number({coerce: true}).int(),
  publish_date: z.date({coerce: true}),
  expired_date: z.date({coerce: true}),
  other_info: z.string().optional(),
  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Certificate>);
export class CreateCertificateBodyDto extends createZodDto(createCertificateBodySchema) { }
