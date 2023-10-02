import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PrismaModule } from 'src/prisma';
import { AppConfigModule } from 'src/config';

@Module({
  imports: [AppConfigModule, PrismaModule],
  providers: [SeederService],
})
export class SeederModule {}
