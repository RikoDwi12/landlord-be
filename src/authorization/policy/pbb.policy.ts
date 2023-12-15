import { BasePolicy } from './base.policy';

export class PbbPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Pbb";
  }
}
