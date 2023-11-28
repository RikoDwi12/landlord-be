import { HttpException, Injectable } from '@nestjs/common';
import {
  StorageManager as BaseStorageManager,
  FileNotFound,
  LocalFileSystemStorageConfig,
} from '@kodepandai/flydrive';
import {
  AmazonWebServicesS3Storage,
  AmazonWebServicesS3StorageConfig,
} from '@kodepandai/flydrive-s3';
import { AppConfigService } from '../config';
import type { Response } from 'express';
import { extname, join } from 'path';
import { lookup } from 'mime-types';
import type { User } from '@prisma/client';

@Injectable()
export class StorageService extends BaseStorageManager {
  constructor(readonly config: AppConfigService) {
    const s3Config = {
      endpoint: config.root.storage.endpoint,
      key: config.root.storage.key,
      secret: config.root.storage.secret,
      region: config.root.storage.region,
      bucket: config.root.storage.bucket,
    };
    super({
      default: config.root.storage.driver,
      disks: {
        local: {
          driver: 'local',
          config: {
            root: config.root.storage.tmpPath,
          } satisfies LocalFileSystemStorageConfig,
        },
        s3: {
          driver: 's3',
          config: s3Config satisfies AmazonWebServicesS3StorageConfig,
        },
        minio: {
          driver: 's3', // minio compatible dengan driver s3
          config: {
            ...s3Config,
            forcePathStyle: true, // required for minio
          } satisfies AmazonWebServicesS3StorageConfig,
        },
      },
    });
    this.registerDriver('s3', AmazonWebServicesS3Storage);
  }

  async streamTmpFile(res: Response, user: User, filename: string) {
    const filePath = this.getFilePath(user, filename);
    const mimeType = this.getMimeType(filePath);
    if (!mimeType) throw new HttpException('unrecognized file type', 400);
    const read = await this.disk('local').getStream(filePath);
    res.setHeader('Content-Type', mimeType);
    return read.pipe(res);
  }

  async getTmpFile(user: User, fileName: string) {
    try {
      const filePath = this.getFilePath(user, fileName);
      const buffer = await this.disk('local').getBuffer(filePath);
      return {
        originalname: fileName,
        buffer: buffer.content,
        mime: this.getMimeType(filePath) || 'application/octet-stream',
        size: Buffer.byteLength(buffer.content),
        ext: extname(filePath),
      };
    } catch (e: unknown) {
      if (e instanceof FileNotFound) {
        throw new HttpException('file not found: ' + fileName, 404);
      }
      throw e;
    }
  }

  removeTmpFile(user: User, filename: string) {
    const filePath = this.getFilePath(user, filename);
    return this.disk('local').delete(filePath);
  }

  private getFilePath(user: User, fileName: string) {
    return join('admin', user.id.toString(), fileName);
  }
  private getMimeType(filePath: string) {
    return lookup(join(this.config.root.storage.tmpPath, filePath));
  }
}
