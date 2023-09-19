import * as bcrypt from 'bcrypt';
import { Seeder } from './seeder.abstract';

export class UserSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('user');
    await this.prisma.user.createMany({
      data: [
        {
          email: 'superadmin@mail.com',
          password: bcrypt.hashSync('password', 10),
          name: 'Super Admin',
          username: 'superadmin',
        },
        {
          email: 'admin@mail.com',
          password: bcrypt.hashSync('password', 10),
          name: 'Admin',
          username: 'admin',
        },
      ],
    });
  }
}
