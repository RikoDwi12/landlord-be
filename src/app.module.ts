import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './config/appConfig.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppFilter } from './app.filter';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule, UserModule],
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
