import { PrismaService } from 'src/prisma';
import { Seeder } from 'src/seeder';
import { Injectable } from '@nestjs/common';
import { Class } from 'src/@types';
import { IndonesiaSeeder as IndonesiaRestore } from 'src/seeder/indonesia.seeder';
import { UserRestore } from './user.restore';
import { NopRestore } from './nop.restore';

@Injectable()
export class RestoreService {
  constructor(private readonly prisma: PrismaService) { }
  async restore() {
    await this.call(IndonesiaRestore);
    await this.call(UserRestore);
    await this.call(NopRestore);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
