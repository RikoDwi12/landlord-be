import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from 'src/config/appConfig.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(readonly config: AppConfigService) {
    super({
      datasources: {
        db: { url: config.root.database.url },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
