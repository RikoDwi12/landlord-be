import { Test, TestingModule } from '@nestjs/testing';
import { NopController } from './nop.controller';
import { NopService } from './nop.service';

describe('NopController', () => {
  let controller: NopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NopController],
      providers: [NopService],
    }).compile();

    controller = module.get<NopController>(NopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
