import { Property, PropertyType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { SchemaDto } from 'src/@types/dto.types';
const updatePropertyBodySchema = z.object({
	group_id: z.number({coerce: true}).int().optional(),
	name: z.string(),
	type: z.nativeEnum(PropertyType),
	address: z.string(),
	city_code: z.string().optional(),
	land_area: z.number({coerce: true}).int(),
	building_area: z.number({coerce: true}).int(),
	dimension: z.string(),
	link_gmap: z.string().optional(),
	lease_price_monthly: z.number({coerce: true}).int(),
	lease_price_yearly: z.number({coerce: true}).int(),
	sell_price: z.number({coerce: true}).int(),
	desc: z.string().optional(),
	is_available: z.boolean(),
	is_leased: z.boolean(),
	other_info: z.string().optional(),  
  // agar rule validasi sesuai denga schema prisma
} satisfies SchemaDto<Property>);
export class UpdatePropertyBodyDto extends createZodDto(updatePropertyBodySchema) { }
