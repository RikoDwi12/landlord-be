import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
