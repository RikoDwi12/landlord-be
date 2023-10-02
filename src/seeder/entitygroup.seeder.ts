import { Seeder } from './seeder.abstract';

export class EntityGroupSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('entityGroup');
    await this.prisma.entityGroup.createMany({
      data: [
        {
          entity_id: 1,
          group_id: 1,
        },
      ],
    });
  }
}
