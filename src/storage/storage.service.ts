import { Injectable } from '@nestjs/common';
import { StorageManager as BaseStorageManager } from '@kodepandai/flydrive';
import {
  AmazonWebServicesS3Storage,
  AmazonWebServicesS3StorageConfig,
} from '@kodepandai/flydrive-s3';
import { AppConfigService } from '../config';

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
}
