import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { AppConfigModule } from 'src/config';
import { UnknownException } from '@kodepandai/flydrive';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('success upload dummy file', async () => {
    await service.disk().put('dummy.txt', Buffer.from('Hello World'), {});
    const file = await service.disk().get('dummy.txt');
    expect(file.content).toBe('Hello World');
  });
  it('can get file url', async () => {
    const publicUrl = service.disk().getUrl('dummy.txt');
    const { signedUrl } = await service.disk().getSignedUrl('dummy.txt');
    expect(publicUrl).toBeDefined();
    expect(signedUrl).toBeDefined();
  });
  it('success delete dummy file', async () => {
    await service.disk().delete('dummy.txt');
    expect(() => service.disk().get('dummy.txt')).rejects.toThrowError(
      UnknownException,
    );
  });
});
