import { Test, TestingModule } from '@nestjs/testing';
import { NopService } from './nop.service';

describe('NopService', () => {
  let service: NopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NopService],
    }).compile();

    service = module.get<NopService>(NopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
