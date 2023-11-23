import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { AppConfigModule } from '../config';
import { RestoreService } from './restore.service';

@Module({
  imports: [AppConfigModule, PrismaModule],
  providers: [RestoreService],
})
export class RestoreModule {}
