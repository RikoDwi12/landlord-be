import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import type { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private readonly storage: StorageService) {}

  upload(file: Express.Multer.File) {
    return { id: file.filename };
  }

  async streamTmpFile(res: Response, user: User, fileName: string) {
    return this.storage.streamTmpFile(res, user, fileName);
  }
}
