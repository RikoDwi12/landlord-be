import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppConfigService } from 'src/config';
import { sanitizeFileName } from 'src/utils';
import { tmpdir } from 'os';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private config: AppConfigService) { }
  createMulterOptions(): MulterModuleOptions {
    const dirPath = join(this.config.root.storage.tmpPath);
    return {
      storage: diskStorage({
        destination: (req, _, cb) => {
          if ((req.user as any)?.id === undefined)
            return cb(
              new UnauthorizedException('user not found'),
              join(tmpdir(), 'trash'),
            );
          const adminPath = join(
            dirPath,
            'admin',
            (req.user as any).id.toString(),
          );
          if (!existsSync(adminPath)) mkdirSync(adminPath, { recursive: true });

          return cb(null, adminPath);
        },
        filename: (_, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          cb(
            null,
            `${sanitizeFileName(name)}-${new Date().getTime()}${fileExtName}`,
          );
        },
      }),
    };
  }
}
