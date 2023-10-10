import { Module } from '@nestjs/common';
import { PbbService } from './pbb.service';
import { PbbController } from './pbb.controller';

@Module({
  controllers: [PbbController],
  providers: [PbbService]
})
export class PbbModule {}
