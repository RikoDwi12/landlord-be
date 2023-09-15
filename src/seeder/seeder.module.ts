import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [],
  providers: [SeederService],
})
export class SeederModule {}
