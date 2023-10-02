import { Seeder } from 'src/seeder';
import * as path from 'path';

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
      await import(path.join(process.cwd(), 'raw/landlordv1/users.json'))
    ).find((data: any) => data.type == 'table').data as OldUser[];
    await this.truncate('user');
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
    console.log('DONE');
  }
}
