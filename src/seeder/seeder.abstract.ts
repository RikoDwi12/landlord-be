import { Class } from '../@types';
import { PrismaService } from '../prisma';

export abstract class Seeder {
  constructor(protected prisma: PrismaService) { }
  async run() { }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder();
    await instance.run();
  }
  async truncate(model: keyof PrismaService) {
    const tableName = await this.prisma.extended[model].getTableName();
    return await this.prisma.$queryRawUnsafe(
      `Truncate "${tableName}" restart identity cascade;`,
    );
  }

  /* saat kita insert manual id, maka autoincrement akan tertinggal
  solusinya harus diset lagi ke id terakhir
  note: ini query hanya untuk postgre */
  async restoreAutoincrement(model: keyof PrismaService) {
    const tableName = await this.prisma.extended[model].getTableName();
    const lastId =
      (
        await (this.prisma[model] as any).aggregate({
          _max: {
            id: true,
          },
        })
      )._max.id || 0;
    return await this.prisma.$queryRawUnsafe(
      `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH ${lastId + 1};`,
    );
  }
}
