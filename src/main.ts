import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config';

(BigInt.prototype as any).toJSON = function () {
	const int = Number.parseInt(this.toString());
	return int ?? this.toString();
  };
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = app.get(AppConfigService).root.app.port;
  await app.listen(port);
}
bootstrap();
