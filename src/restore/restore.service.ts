import { PrismaService } from 'src/prisma';
import { Seeder } from 'src/seeder';
import { Injectable } from '@nestjs/common';
import { Class } from 'src/@types';
import { IndonesiaSeeder as IndonesiaRestore } from 'src/seeder/indonesia.seeder';
import { UserRestore } from './user.restore';
import { NopRestore } from './nop.restore';
import { PbbRestore } from './pbb.restore';
import { PropertyRestore } from './property.restore';
import { CertificateRestore } from './certificate.restore';
import { CrmRestore } from './crm.restore';

@Injectable()
export class RestoreService {
  constructor(private readonly prisma: PrismaService) { }
  async restore() {
    await this.call(IndonesiaRestore);
    await this.call(UserRestore);
    await this.call(NopRestore);
    await this.call(PbbRestore);
    await this.call(CertificateRestore);
    await this.call(PropertyRestore);
    await this.call(CrmRestore);
  }
  async call<T extends Seeder>(seeder: Class<T>): Promise<void> {
    const instance = new seeder(this.prisma);
    await instance.run();
  }
}
