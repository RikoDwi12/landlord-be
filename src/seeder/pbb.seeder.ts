import { Seeder } from "./seeder.abstract";


export class PbbSeeder extends Seeder {
	async run(): Promise<void> {
		await this.truncate('pbb');
		await this.prisma.pbb.createMany({
			data: [
				{
					nop_id: 1,
					year: '2023',
					land_area: 100,
					building_area: 100,
					njop_land: 100,
					njop_building: 100,
					njop_no_tax: 123,
					taxpayer_id: 1,
					stimulus: 123,
					multiplier: 1,
					payment_fee: 1000,
					payment_date: new Date()
				},
				{
					nop_id: 2,
					year: '2023',
					land_area: 100,
					building_area: 100,
					njop_land: 100,
					njop_building: 100,
					njop_no_tax: 123,
					taxpayer_id: 2,
					stimulus: 123,
					multiplier: 1,
					payment_fee: 1000,
					payment_date: new Date()
				},
				{
					nop_id: 3,
					year: '2023',
					land_area: 100,
					building_area: 100,
					njop_land: 100,
					njop_building: 100,
					njop_no_tax: 123,
					taxpayer_id: 3,
					stimulus: 123,
					multiplier: 1,
					payment_fee: 1000,
					payment_date: new Date()
				},
			]
		})
	}
}