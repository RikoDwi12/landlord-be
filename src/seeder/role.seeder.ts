import { Permission, modules } from 'src/role/permission.const';
import { Seeder } from './seeder.abstract';

export class RoleSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('role');
    const godModules = ["Role"];
    await this.prisma.role.createMany({
      data: [
        {
          name: 'God',
          permissions: ['*', 'Role.*'] satisfies Permission[],
        },
        {
          name: 'Admin',
          permissions: modules.filter(m=>!godModules.includes(m)).map((m) => `${m}.*` as const) satisfies Permission[],
        },
        {
          name: 'Viewer',
          permissions: modules.filter(m=>!godModules.includes(m)).map((m) => `${m}.read` as const) satisfies Permission[],
        },
      ],
    });
  }
}
