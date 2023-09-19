import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './appConfig.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig } from './env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule { }
