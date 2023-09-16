import { NestFactory } from '@nestjs/core';
import { SeederModule } from 'src/seeder/seeder.module';
import { SeederService } from 'src/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  await app.get(SeederService).seed();
  await app.close();
}
bootstrap();
