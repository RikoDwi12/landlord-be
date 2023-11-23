import { Prisma, PropertyType } from '@prisma/client';
import { Seeder } from './seeder.abstract';
import { faker } from '@faker-js/faker';

export class PropertiesSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('property');

    const numberOfIndex = 5;
    const data: Prisma.PropertyCreateManyInput[] = [];

    for (let i = 0; i <= numberOfIndex; i++) {
      const entry = {
        name: 'properti ' + i,
        type: Object.values(PropertyType)[
          faker.number.int({
            min: 0,
            max: Object.values(PropertyType).length - 1,
          })
        ],
        address: 'alamat properti ' + i,
        land_area: faker.number.int({ min: 100, max: 300 }),
        building_area: faker.number.int({ min: 100, max: 600 }),
        dimension: '10 x 10',
        lease_price_monthly: 1000000,
        lease_price_yearly: 100000000,
        sell_price: 1000000000,
        is_available: true,
      };

      data.push(entry);
    }
    await this.prisma.property.createMany({
      data,
    });
  }
}
