import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { AppConfigModule } from './config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'src/vendor/nest-zod';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { AppFilter } from './app.filter';
import { GroupModule } from './group';
import { EntityModule } from './entity/entity.module';
import { NopModule } from './nop/nop.module';
import { PbbModule } from './pbb/pbb.module';
import { IndonesiaModule } from './indonesia/indonesia.module';
import { PropertyModule } from './property/property.module';
import { CrmModule } from './crm/crm.module';
import { StorageModule } from './storage/storage.module';
import { FileModule } from './media/file.module';
import { MediaModule } from './media/media.module';
import { LegalModule } from './legal/legal.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    GroupModule,
    PropertyModule,
    EntityModule,
    NopModule,
    PbbModule,
    CrmModule,
    IndonesiaModule,
    StorageModule,
    MediaModule,
    FileModule,
    LegalModule,
  ],
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
export class AppModule { }
