import { faker } from '@faker-js/faker';
import { Seeder } from './seeder.abstract';
import { CertificateStatus, CertificateType, Prisma } from '@prisma/client';

export class SertifikatSeeder extends Seeder {
	async run(): Promise<void> {
		await this.truncate('certificate');

		const numberOfIndex = 3;
		const data: Prisma.CertificateCreateManyInput[] = [];

		const propertiIds = (
			await this.prisma.property.findMany({
				select: {
					id: true,
				},
			})
		).map((p) => p.id);
		const districtIds = await this.prisma.subDistrict.findMany({
			select: {
				code: true,
			},
		});
		const entityIds = await this.prisma.entity.findMany({
			select: {
				id: true,
			},
		});

		const groupIds = await this.prisma.group.findMany({
			select: {
				id: true,
			},
		});

		for (let i = 0; i <= numberOfIndex; i++) {
			const entry = {
				id: i + 1,
				property_id:
					propertiIds[
					faker.number.int({ min: 0, max: propertiIds.length - 1 })
					],
				behalf_of_id:
					entityIds[faker.number.int({ min: 0, max: entityIds.length - 1 })].id,
				group_id:
					groupIds[faker.number.int({ min: 0, max: groupIds.length - 1 })].id,
				type: Object.values(CertificateType)[
					faker.number.int({
						min: 0,
						max: Object.values(CertificateType).length - 1,
					})
				],
				no: faker.string.numeric({ length: 3 }),
				subdistrict_code:
					districtIds[faker.number.int({ min: 0, max: districtIds.length - 1 })]
						.code,
				address: faker.location.streetAddress(),
				location_name: faker.location.street(),
				original_cert: 'none',
				original_doc: 'none',
				copy_archive: 'archive',
				no_copy_archive: 'none',
				ownership_status:
					Object.values(CertificateStatus)[
					faker.number.int({
						min: 0,
						max: Object.values(CertificateStatus).length - 1,
					})
					],
				owner_id:
					entityIds[faker.number.int({ min: 0, max: entityIds.length - 1 })].id,
				functional: 'none',
				land_area: 100,
				ajb_notary_id:
					entityIds[faker.number.int({ min: 0, max: entityIds.length - 1 })].id,
				ajb_no: faker.string.numeric({ length: 3 }),
				ajb_date: new Date(),
				ajb_total: faker.number.int({ min: 10000000, max: 1000000000 }),
				publish_date: new Date(),
				expired_date: new Date(),
				other_info: 'none',
				documents: 'none',
				document_activities: 'none',
			} as Prisma.CertificateCreateManyInput;

			data.push(entry);
		}
		await this.prisma.certificate.createMany({
			data,
		});
	}
}
