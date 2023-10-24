import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './appConfig.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig } from './env';
import { storageConfig } from './env/storage.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, storageConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
