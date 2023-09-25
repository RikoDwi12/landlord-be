import { Seeder } from "./seeder.abstract"


export class EntitiesSeeder extends Seeder {
	async run(): Promise<void> {
		await this.truncate('entity')
		await this.prisma.entity.createMany({
			data: [
				{
					type: "PT",
					name: "PT A",
				},
				{
					type: "CV",
					name: 'CV A',
				},
				{
					type: "FIRMA",
					name: 'Firma A',
				},
				{
					type: "PERORANGAN",
					name: 'Perorangan A',
				}
			]
		})
	}
}