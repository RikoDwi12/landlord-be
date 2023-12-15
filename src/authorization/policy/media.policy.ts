import { BasePolicy } from './base.policy';

export class MediaPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Media";
  }
}
