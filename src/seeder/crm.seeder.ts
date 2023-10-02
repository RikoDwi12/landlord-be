import { Seeder } from './seeder.abstract';

export class CrmSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('crm');
    await this.prisma.crm.createMany({
      data: [
        {
          property_id: 1,
          date: new Date(),
          prospect_client_id: 1,
          prospect_desc: 'description',
        },
        {
          property_id: 2,
          date: new Date(),
          prospect_client_id: 2,
          prospect_desc: 'description',
        },
        {
          property_id: 3,
          date: new Date(),
          prospect_client_id: 3,
          prospect_desc: 'description',
        },
      ],
    });
  }
}
