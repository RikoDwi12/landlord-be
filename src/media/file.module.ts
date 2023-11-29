import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config.service';
import { StorageModule } from 'src/storage/storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MediaModule } from './media.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    StorageModule,
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    MediaModule,
  ],
})
export class FileModule {}
