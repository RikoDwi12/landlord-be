import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = app.get(AppConfigService).root.app.port;
  await app.listen(port);
}
bootstrap();
