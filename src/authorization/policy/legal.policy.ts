import { BasePolicy } from './base.policy';

export class LegalPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Legal";
  }
}
