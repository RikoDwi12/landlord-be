import { PrismaService } from 'src/prisma';
import { Seeder } from './seeder.abstract';
import { Injectable } from '@nestjs/common';
import { Class } from 'src/@types';
import { IndonesiaSeeder } from './indonesia.seeder';
import { UserSeeder } from './user.seeder';
import { SertifikatSeeder } from './sertifikat.seeder';
import { CrmSeeder } from './crm.seeder';
import { EntitiesSeeder } from './entities.seeder';
import { EntityGroupSeeder } from './entitygroup.seeder';
import { GroupSeeder } from './groups.seeder';
import { NopSeeder } from './nops.seeder';
import { PbbSeeder } from './pbb.seeder';
import { PropertiesSeeder } from './properties.seeder';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) { }
  async seed() {
    await this.call(IndonesiaSeeder);
    await this.call(UserSeeder);
    await this.call(EntitiesSeeder);
    await this.call(GroupSeeder);
    await this.call(PropertiesSeeder);
    await this.call(SertifikatSeeder);
    await this.call(CrmSeeder);
    await this.call(EntityGroupSeeder);
    await this.call(NopSeeder);
    await this.call(PbbSeeder);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
