import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PrismaModule } from '../prisma';
import { AppConfigModule } from '../config';

@Module({
  imports: [AppConfigModule, PrismaModule],
  providers: [SeederService],
})
export class SeederModule { }
