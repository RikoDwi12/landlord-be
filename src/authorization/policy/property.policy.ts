import { BasePolicy } from './base.policy';

export class PropertyPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Property";
  }
}
