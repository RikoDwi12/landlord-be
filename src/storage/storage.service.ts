import { HttpException, Injectable } from '@nestjs/common';
import {
  StorageManager as BaseStorageManager,
  LocalFileSystemStorageConfig,
} from '@kodepandai/flydrive';
import {
  AmazonWebServicesS3Storage,
  AmazonWebServicesS3StorageConfig,
} from '@kodepandai/flydrive-s3';
import { AppConfigService } from '../config';
import type { Response } from 'express';
import { join } from 'path';
import { lookup } from 'mime-types';

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
            // forcePathStyle: true, // required for minio
          } satisfies AmazonWebServicesS3StorageConfig,
        },
      },
    });
    this.registerDriver('s3', AmazonWebServicesS3Storage);
  }

  async streamTmpFile(res: Response, filename: string, userId: number) {
    const filePath = join('admin', userId.toString(), filename);
    const mimeType = lookup(join(this.config.root.storage.tmpPath, filePath));
    if (!mimeType) throw new HttpException('unrecognized file type', 400);
    const read = await this.disk('local').getStream(filePath);
    res.setHeader('Content-Type', mimeType);
    return read.pipe(res);
  }
}
