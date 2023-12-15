import { BasePolicy } from './base.policy';

export class NopPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Nop";
  }
}
