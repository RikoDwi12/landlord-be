import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config.service';
import { StorageModule } from 'src/storage/storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    StorageModule,
    MulterModule.registerAsync({ useClass: MulterConfigService }),
  ],
})
export class FileModule {}
