import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { AppConfigModule } from 'src/config';
import { RestoreService } from './restore.service';

@Module({
  imports: [AppConfigModule, PrismaModule],
  providers: [RestoreService],
})
export class RestoreModule {}
