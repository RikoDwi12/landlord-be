import { NestFactory } from '@nestjs/core';
import { SeederModule, SeederService } from '../seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  await app.get(SeederService).seed();
  await app.close();
}
bootstrap();
