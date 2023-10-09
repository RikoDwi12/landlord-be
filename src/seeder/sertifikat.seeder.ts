import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.abstract';
import { Prisma } from '@prisma/client';

export class SertifikatSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('certificate');


	const numberOfIndex = 3;
	const data: Prisma.CertificateCreateManyInput[] = [];

	const propertiIds = (await this.prisma.property.findMany({
		select: {
			id: true
		}
	})).map((p) => p.id);

	
	for(let i = 0; i <= numberOfIndex; i++ ){
		const entry = {
			id: i,
			property_id: propertiIds[faker.number.int({min: 0, max: propertiIds.length - 1})],
			behalf_of_id: i,
			group_id: i,
			type: 'SHGB',
			no: faker.string.numeric({length: 3}),
			subdistrict_code: '123',
			address: faker.location.streetAddress(),
			location_name: faker.location.street(),
			original_cert: 'none',
			original_doc: 'none',
			copy_archive: 'archive',
			no_copy_archive: 'none',
			ownership_status: 'MILIK_SENDIRI',
			owner_id: i,
			functional: 'none',
			land_area: 100,
			ajb_notary_id: i,
			ajb_no: faker.string.numeric({length: 3}),
			ajb_date: new Date(),
			ajb_total: faker.number.int({min: 10000000, max: 1000000000}),
			publish_date: new Date(),
			expired_date: new Date(),
			other_info: 'none',
			documents: 'none',
			document_activities: 'none',
		} as Prisma.CertificateCreateManyInput;

		data.push(entry);
	}
    await this.prisma.certificate.createMany({
		data
	})
  }
}