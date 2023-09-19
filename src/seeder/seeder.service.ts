import { PrismaService } from 'src/prisma';
import { Seeder } from './seeder.abstract';
import { Injectable } from '@nestjs/common';
import { Class } from 'src/@types';
import { IndonesiaSeeder } from './indonesia.seeder';
import { UserSeeder } from './user.seeder';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) { }
  async seed() {
    await this.call(IndonesiaSeeder);
    await this.call(UserSeeder);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
