import { Module } from '@nestjs/common';
import { NopService } from './nop.service';
import { NopController } from './nop.controller';

@Module({
  controllers: [NopController],
  providers: [NopService]
})
export class NopModule {}
