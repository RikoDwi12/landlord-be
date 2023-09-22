import { NestFactory } from '@nestjs/core';
import { RestoreModule } from 'src/restore/restore.module';
import { RestoreService } from 'src/restore/restore.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(RestoreModule);
  await app.get(RestoreService).restore();
  await app.close();
}
bootstrap();
