import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfigService } from 'src/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(readonly config: AppConfigService) {
    super({
      datasources: {
        db: { url: config.root.database.url },
      },
    });
  }
  get extended() {
    const prisma = this.$extends({
      model: {
        $allModels: {
          async getTableName<T>(this: T) {
            const context = Prisma.getExtensionContext(this) as any;
            return (prisma as any)._runtimeDataModel.models[context.name]
              .dbName;
          },
        },
      },
    });
    return prisma;
  }
  async onModuleInit() {
    await this.$connect();
  }
}
