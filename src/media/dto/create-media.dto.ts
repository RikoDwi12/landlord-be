import { Media, MediaTag } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
import { Mediable } from '../media.const';
import { extendApi } from '@anatine/zod-openapi';
const createMediaBodySchema = z.object({
  mediable_type: z.nativeEnum(Mediable),
  mediable_id: z.number({ coerce: true }),
  tags: z.array(z.nativeEnum(MediaTag)),
} satisfies SchemaDto<Media, QueryableDto>);

export class CreateMediaBodyDto extends createZodDto(createMediaBodySchema) { }

// ini digunakan di module yang punya media attachments
// tinggal di extends
export const attachMediaBodySchema = z.object({
  attachments: z.array(
    z.object({ id: z.union([z.number({ coerce: true }), z.string()]) }),
  ),
});

export const uploadSchemaDto = extendApi(
  z.object({
    file: z.any().transform((val) => val as Express.Multer.File),
  }),
);
export class UpdloadDto extends createZodDto(uploadSchemaDto) { }
