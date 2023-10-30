import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import type { Response } from 'express';

@Injectable()
export class FileService {
  constructor(private readonly storage: StorageService) {}

  upload(file: Express.Multer.File) {
    return { key: file.filename };
  }

  async streamTmpFile(res: Response, userId: number, fileName: string) {
    return this.storage.streamTmpFile(res, userId, fileName);
  }
}
