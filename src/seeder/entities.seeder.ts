import { Prisma } from '@prisma/client';
import { Seeder } from './seeder.abstract';
import { faker } from '@faker-js/faker';

export class EntitiesSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('entity');

    const categories = [
      'BROKER',
      'CLIENT',
      'NOTARIS',
      'LANDLORD',
      'PIC',
      'SAKSI',
      'OTHER',
    ];

    const numberOfIndex = 100;
    const data: Prisma.EntityCreateManyInput[] = [];

    for (let i = 0; i <= numberOfIndex; i++) {
      const entry = {
        categories: [
          categories[Math.floor(Math.random() * categories.length)],
        ] as Prisma.EntityCreateManyInput['categories'],
        type: 'PT',
        name: faker.person.fullName(),
      } satisfies Prisma.EntityCreateManyInput;

      data.push(entry);
    }

    await this.prisma.entity.createMany({
      data,
    });
  }
}
