import {
  Certificate,
  CertificateStatus,
  CertificateType,
} from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findCertificateQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(['created_at']).optional().default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  type: z.array(z.nativeEnum(CertificateType)).optional(),
  status: z.array(z.nativeEnum(CertificateStatus)).optional(),
  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Certificate, QueryableDto>);
export class FindCertificateQueryDto extends createZodDto(
  findCertificateQuerySchema,
) {}
