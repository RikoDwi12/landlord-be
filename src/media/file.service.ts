import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import type { Response } from 'express';
import type { Media, User } from '@prisma/client';
import { MediaService } from './media.service';

@Injectable()
export class FileService {
  constructor(
    private readonly storage: StorageService,
    private readonly media: MediaService,
  ) {}

  upload(file: Express.Multer.File) {
    return { id: file.filename };
  }

  async streamTmpFile(res: Response, user: User, fileName: string) {
    return this.storage.streamTmpFile(res, user, fileName);
  }

  renameMedia(media: Pick<Media, 'id' | 'title'>) {
    return this.media.update(media);
  }
}
