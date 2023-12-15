import { subject } from '@casl/ability';
import { BasePolicy } from './base.policy';

export class UserPolicy extends BasePolicy {
  protected setup(): void {
    this.model = 'User';
  }
  profile() {
    return this.authorize('read', subject('User', this.user));
  }

  ability() {
    return this.authorize('read', subject('User', this.user));
  }
}
