import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { MediaModule } from 'src/media';

@Module({
  imports: [MediaModule],
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule { }
