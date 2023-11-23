import { Certificate } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { SchemaDto } from '../../@types/dto.types';
import { createCertificateBodySchema } from './create-certificate.dto';
const updateCertificateBodySchema = createCertificateBodySchema.extend(
  {} satisfies SchemaDto<Certificate>,
);
export class UpdateCertificateBodyDto extends createZodDto(
  updateCertificateBodySchema,
) {}
