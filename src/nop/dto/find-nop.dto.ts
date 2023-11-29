import { Nop } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '../../@types/dto.types';
const findNopQuerySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum([
      'id',
      'nop',
      'created_at',
      'taxpayer.name',
      'location',
      'subdistrict.name',
      'subdistrict.district.name',
      'subdistrict.district.city.name',
      'land_area',
      'building_area',
    ])
    .optional()
    .default('created_at'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  //filterable
  //multiple filter
  taxpayer_id: z.array(z.number({ coerce: true })).optional(),
  subdistrict_code: z
    .array(z.number({ coerce: true }))
    .transform((x) => x.map((x) => x.toString()))
    .optional(),
  city_code: z
    .array(z.number({ coerce: true }))
    .transform((x) => x.map((x) => x.toString()))
    .optional(),
  //single filter
  has_certificate: z
    .number({ coerce: true })
    .pipe(z.boolean({ coerce: true }))
    .optional(),

  //pagination
  limit: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).optional(),
} satisfies SchemaDto<Nop, QueryableDto>);
export class FindNopQueryDto extends createZodDto(findNopQuerySchema) {}
