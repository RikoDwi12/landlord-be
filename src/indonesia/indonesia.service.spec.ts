import { Test, TestingModule } from '@nestjs/testing';
import { IndonesiaService } from './indonesia.service';

describe('IndonesiaService', () => {
  let service: IndonesiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndonesiaService],
    }).compile();

    service = module.get<IndonesiaService>(IndonesiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
