import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './appConfig.service';
import { ConfigModule } from '@nestjs/config';
import rootConfig from './configs/root.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rootConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
