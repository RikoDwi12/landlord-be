import { Module } from '@nestjs/common';
import { IndonesiaService } from './indonesia.service';
import { IndonesiaController } from './indonesia.controller';

@Module({
  controllers: [IndonesiaController],
  providers: [IndonesiaService]
})
export class IndonesiaModule {}
