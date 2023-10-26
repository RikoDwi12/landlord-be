import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  providers: [MediaService],
  exports: [MediaService],
  imports: [StorageModule],
})
export class MediaModule { }
