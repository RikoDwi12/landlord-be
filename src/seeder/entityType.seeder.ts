import { Seeder } from './seeder.abstract';
import { ENTITY_TYPES } from 'src/entity/entity.const';
import { constToOption } from 'src/utils';

export class EntityTypeSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('entityType');

    await this.prisma.entityType.createMany({
      data: constToOption(ENTITY_TYPES).map(({ label, value }) => ({
        label,
        value,
      })),
    });
  }
}
