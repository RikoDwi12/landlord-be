import { PrismaService } from 'src/prisma/prisma.service';
import { Seeder } from './seeder.abstract';
import { IndonesiaSeeder } from './seeders/indonesia.seeder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}
  async seed() {
    await this.call(IndonesiaSeeder);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
