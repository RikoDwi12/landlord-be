import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { IndonesiaModule } from 'src/indonesia/indonesia.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [IndonesiaModule, MediaModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule { }
