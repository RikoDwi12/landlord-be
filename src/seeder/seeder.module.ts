import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppConfigModule } from 'src/config/appConfig.module';

@Module({
  imports: [AppConfigModule, PrismaModule],
  providers: [SeederService],
})
export class SeederModule {}
