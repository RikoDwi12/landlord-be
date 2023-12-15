import { BasePolicy } from './base.policy';

export class CrmPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Crm";
  }
}
