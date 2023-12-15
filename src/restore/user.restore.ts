import { Seeder } from '../seeder';
import path from 'path';

interface OldUser {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}
export class UserRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring users...');
    const oldUsers = (
      await import(path.join(process.cwd(), 'raw/landlordv1/users.json'), {
        assert: { type: 'json' },
      })
    ).default.find((data: any) => data.type == 'table').data as OldUser[];
    await this.prisma.user.createMany({
      data: oldUsers.map((o) => ({
        id: o.id,
        name: o.name,
        username: o.username,
        email: o.email,
        created_at: o.created_at,
        updated_at: o.updated_at,
        deleted_at: o.is_active ? null : new Date(),
        password: o.password.replace('$2y', '$2b'),
      })),
    });
    await this.restoreAutoincrement('user');
    console.log('DONE');
    console.log('restoring users roles...');
    const admin = await this.prisma.role.findFirstOrThrow({
      where: {
        name: 'Admin',
      },
    });
    const god = await this.prisma.role.findFirstOrThrow({
      where: {
        name: 'God',
      },
    });
    await this.prisma.userRole.createMany({
      data: oldUsers.map((u) => ({
        user_id: u.id,
        role_id: u.username == 'leon' ? god.id : admin.id,
      })),
    });
    console.log('DONE');
  }
}
