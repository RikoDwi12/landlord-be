import { PrismaService } from 'src/prisma/prisma.service';
import { Seeder } from './seeder.abstract';
import { IndonesiaSeeder } from './seeders/indonesia.seeder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {
    console.log({ prisma: this.prisma });
  }
  async seed() {
    setTimeout(async () => {
      console.log('seedeing');
      console.log(this.prisma);
      console.log(await this.prisma.user.findMany());
    }, 3000);
    // await this.call(IndonesiaSeeder);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
