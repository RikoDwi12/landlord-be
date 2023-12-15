import type { User } from '@prisma/client';
import type { AuthorizationService } from './authorization.service';
import { ModelNames } from 'src/@types';

export class Policy {
  protected model?: ModelNames;
  constructor(
    protected readonly authorization: AuthorizationService,
    protected readonly user: User,
    protected readonly param?: any,
  ) {
    this.setup();
  }
  protected setup(){
    throw new Error('Method setup not implemented.');
  }
}
