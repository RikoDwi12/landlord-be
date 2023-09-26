import { Seeder } from './seeder.abstract';

export class SertifikatSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('certificate');
    await this.prisma.certificate.createMany({
      data: [
        {
          property_id: 1,
          behalf_of_id: 1,
          type: 'SHGB',
          no: '123',
          land_area: 100,
          ajb_notary_id: 1,
          ajb_no: '123',
          publish_date: new Date(),
          expired_date: new Date(),
        },
        {
          property_id: 2,
          behalf_of_id: 2,
          type: 'SHGB',
          no: '123',
          land_area: 100,
          ajb_notary_id: 2,
          ajb_no: '123',
          publish_date: new Date(),
          expired_date: new Date(),
        },
        {
          property_id: 3,
          behalf_of_id: 3,
          type: 'SHGB',
          no: '123',
          land_area: 100,
          ajb_notary_id: 3,
          ajb_no: '123',
          publish_date: new Date(),
          expired_date: new Date(),
        },
      ],
    });
  }
}
