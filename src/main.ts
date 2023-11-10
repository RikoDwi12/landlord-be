import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

// Result dari prisma terkadang ada yang tipe BigInt
// saat direturn, maka nestJS akan stringify menggunakan JSON.stringify
// dan akan error. Kode di bawah ini adalah workaroundnya
(BigInt.prototype as any).toJSON = function() {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

// patch nestjs agar swagger bisa menampilkan zod schema
patchNestjsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = app.get(AppConfigService).root.app.port;

  const config = new DocumentBuilder()
    .setTitle('Landlord')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(port);
  console.log('server run on http://localhost:' + port);
}
bootstrap();
