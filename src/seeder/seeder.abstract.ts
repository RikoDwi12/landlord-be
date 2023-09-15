import { PrismaService } from 'src/prisma/prisma.service';

export abstract class Seeder {
  constructor(protected prisma: PrismaService) { }
  async run() { }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder();
    await instance.run();
  }
}
