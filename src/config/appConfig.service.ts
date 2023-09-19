import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';
import { rootConfig } from 'src/@types';

@Injectable()
export class AppConfigService extends BaseConfigService {
  get root() {
    return new Proxy(
      {},
      {
        get: (_, prop: keyof rootConfig) => {
          return this.get(prop);
        },
      },
    ) as rootConfig;
  }
}
