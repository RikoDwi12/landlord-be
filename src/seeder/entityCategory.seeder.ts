import { Seeder } from './seeder.abstract';
import { ENTITY_CATEGORIES } from 'src/entity/entity.const';
import { constToOption } from 'src/utils';

export class EntityCategorySeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('entityCategory');

    await this.prisma.entityCategory.createMany({
      data: constToOption(ENTITY_CATEGORIES).map(({ label, value }) => ({
        label,
        value,
      })),
    });
  }
}
