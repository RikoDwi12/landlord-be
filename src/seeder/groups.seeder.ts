import { Seeder } from './seeder.abstract';

export class GroupSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('group');
    await this.prisma.group.createMany({
      data: [
        {
          name: 'Group 1',
        },
        {
          name: 'Group 2',
        },
        {
          name: 'Group 3',
        },
      ],
    });
  }
}
