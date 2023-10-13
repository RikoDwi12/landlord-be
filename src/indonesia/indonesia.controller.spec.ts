import { Test, TestingModule } from '@nestjs/testing';
import { IndonesiaController } from './indonesia.controller';
import { IndonesiaService } from './indonesia.service';

describe('IndonesiaController', () => {
  let controller: IndonesiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndonesiaController],
      providers: [IndonesiaService],
    }).compile();

    controller = module.get<IndonesiaController>(IndonesiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
