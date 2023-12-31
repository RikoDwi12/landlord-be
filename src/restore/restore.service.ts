import { PrismaService } from '../prisma';
import { Seeder } from '../seeder';
import { Injectable } from '@nestjs/common';
import { Class } from '../@types';
import { IndonesiaSeeder as IndonesiaRestore } from '../seeder/indonesia.seeder';
import { UserRestore } from './user.restore';
import { NopRestore } from './nop.restore';
import { PbbRestore } from './pbb.restore';
import { PropertyRestore } from './property.restore';
import { CertificateRestore } from './certificate.restore';
import { CrmRestore } from './crm.restore';
import { EntityCategorySeeder as EntityCategoryRestore } from '../seeder/entityCategory.seeder';
import { EntityTypeSeeder as EntityTypeRestore } from '../seeder/entityType.seeder';
import { PrepareRestore } from './prepare.restore';
import { RoleSeeder as RoleRestore } from "../seeder/role.seeder";

@Injectable()
export class RestoreService {
  constructor(private readonly prisma: PrismaService) {}
  async restore() {
    await this.call(PrepareRestore);
    await this.call(IndonesiaRestore);
    await this.call(RoleRestore);
    await this.call(UserRestore);
    await this.call(EntityCategoryRestore);
    await this.call(EntityTypeRestore);
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
