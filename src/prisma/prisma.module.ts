import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppConfigModule } from 'src/config/appConfig.module';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
