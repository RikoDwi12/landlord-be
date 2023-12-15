import bcrypt from 'bcrypt';
import { Seeder } from './seeder.abstract';

export class UserSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('user');
    await this.prisma.user.createMany({
      data: [
        {
          email: 'god@mail.com',
          password: bcrypt.hashSync('password', 10),
          name: 'God',
          username: 'god',
        },
        {
          email: 'superadmin@mail.com',
          password: bcrypt.hashSync('password', 10),
          name: 'Super Admin',
          username: 'superadmin',
        },
        {
          email: 'viewer@mail.com',
          password: bcrypt.hashSync('password', 10),
          name: 'Viewer',
          username: 'viewer',
        },
      ],
    });

    const god = await this.prisma.user.findFirstOrThrow({
      where: {
        email: 'god@mail.com',
      }
    })
    const superadmin = await this.prisma.user.findFirstOrThrow({
      where: {
        email: 'superadmin@mail.com',
      }
    })
    const viewer = await this.prisma.user.findFirstOrThrow({
      where: {
        email: "viewer@mail.com",
      }
    })

    await this.prisma.userRole.createMany({
      data: [
        {
          user_id: god.id,
          role_id: (await this.prisma.role.findFirstOrThrow({
            where: {
              name: "God"
            }
          })).id
        },
        {
          user_id: superadmin.id,
          role_id: (await this.prisma.role.findFirstOrThrow({
            where: {
              name: "Admin"
            }
          })).id
        },
        {
          user_id: viewer.id,
          role_id: (await this.prisma.role.findFirstOrThrow({
            where: {
              name: "Viewer"
            }
          })).id
        }
      ]
    })
  }
}
