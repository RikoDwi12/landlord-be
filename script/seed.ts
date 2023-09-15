import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SeederModule } from 'src/seeder/seeder.module';
import { SeederService } from 'src/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.get(SeederService).seed();
  app.close();
}
bootstrap();
