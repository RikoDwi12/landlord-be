import { Seeder } from './seeder.abstract';
import { faker } from '@faker-js/faker';

export class NopSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('nop');
    await this.prisma.nop.createMany({
      data: [
        {
          nop: faker.finance.creditCardNumber('#.###.###.###.###'),
          taxpayer_id: 1,
          location: 'Semarang',
          land_area: 100,
          building_area: 100,
        },
        {
          nop: faker.finance.creditCardNumber('#.###.###.###.###'),
          taxpayer_id: 2,
          location: 'Semarang',
          land_area: 200,
          building_area: 200,
        },
        {
          nop: faker.finance.creditCardNumber('#.###.###.###.###'),
          taxpayer_id: 3,
          location: 'Semarang',
          land_area: 300,
          building_area: 300,
        },
      ],
    });
  }
}
