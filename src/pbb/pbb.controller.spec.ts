import { Test, TestingModule } from '@nestjs/testing';
import { PbbController } from './pbb.controller';
import { PbbService } from './pbb.service';

describe('PbbController', () => {
  let controller: PbbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PbbController],
      providers: [PbbService],
    }).compile();

    controller = module.get<PbbController>(PbbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
