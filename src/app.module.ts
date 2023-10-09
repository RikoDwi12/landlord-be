import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { AppFilter } from './app.filter';
import { GroupModule } from './group';
import { EntityModule } from './entity/entity.module';
import { NopModule } from './nop/nop.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule, UserModule, GroupModule, EntityModule, NopModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
  ],
})
export class AppModule {}
