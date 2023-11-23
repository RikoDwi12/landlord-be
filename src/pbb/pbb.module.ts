import { Module } from '@nestjs/common';
import { PbbService } from './pbb.service';
import { PbbController } from './pbb.controller';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [PbbController],
  providers: [PbbService],
})
export class PbbModule {}
