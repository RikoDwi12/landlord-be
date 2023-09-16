import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [PrismaModule, SeederModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
