import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { MediaModule } from 'src/media/media.module';
import { IndonesiaModule } from 'src/indonesia/indonesia.module';

@Module({
  imports: [MediaModule, IndonesiaModule],
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule {}
