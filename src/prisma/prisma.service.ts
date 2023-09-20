import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfigService } from 'src/config';
import { extension as paginate } from 'prisma-paginate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private extendedClient: any;
  constructor(readonly config: AppConfigService) {
    super({
      datasources: {
        db: { url: config.root.database.url },
      },
    });
  }
  get extended() {
    let prisma: ReturnType<typeof this.extendClient> = this.extendedClient;
    if (!prisma) {
      prisma = this.extendClient();
    }
    return prisma;
  }
  private extendClient() {
    const prisma = this.$extends({
      model: {
        $allModels: {
          async getTableName<T>(this: T) {
            const context = Prisma.getExtensionContext(this) as any;
            return (prisma as any)._runtimeDataModel.models[context.name]
              .dbName;
          },
          ...paginate.model.$allModels,
        },
      },
    });
    this.extendedClient = prisma;
    return prisma;
  }
  async onModuleInit() {
    await this.$connect();
  }
}
