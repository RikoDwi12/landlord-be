import { Test, TestingModule } from '@nestjs/testing';
import { PbbService } from './pbb.service';

describe('PbbService', () => {
  let service: PbbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PbbService],
    }).compile();

    service = module.get<PbbService>(PbbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
