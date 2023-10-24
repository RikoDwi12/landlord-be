import { NestFactory } from '@nestjs/core';
import { RestoreModule } from '../restore/restore.module';
import { RestoreService } from '../restore/restore.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(RestoreModule);
  await app.get(RestoreService).restore();
  await app.close();
}
bootstrap();
