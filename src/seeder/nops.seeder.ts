import { Seeder } from "./seeder.abstract";


export class NopSeeder extends Seeder {
	async run(): Promise<void> {
		await this.truncate('nop')
		await this.prisma.nop.createMany({
			data: [
				{
					taxpayer_id: 1,
					location: 'Semarang',
					land_area: 100,
					building_area: 100,
				},
				{
					taxpayer_id: 2,
					location: 'Semarang',
					land_area: 200,
					building_area: 200,
				},
				{
					taxpayer_id: 3,
					location: 'Semarang',
					land_area: 300,
					building_area: 300,
				},
			]
		})
	}
}