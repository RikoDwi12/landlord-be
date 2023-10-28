import { HttpException, Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { join } from 'path';
import type { Response } from 'express';
import { lookup } from 'mime-types';

@Injectable()
export class FileService {
  constructor(private readonly storage: StorageService) {}

  upload(file: Express.Multer.File) {
    return { key: file.filename };
  }

  async streamTmpFile(res: Response, filename: string, userId: number) {
    const filePath = join('admin', userId.toString(), filename);
    const mimeType = lookup(
      join(this.storage.config.root.storage.tmpPath, filePath),
    );
    if (!mimeType) throw new HttpException('unrecognized file type', 400);
    const read = await this.storage.disk('local').getStream(filePath);
    res.setHeader('Content-Type', mimeType);
    return read.pipe(res);
  }
}
