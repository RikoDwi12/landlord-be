import { BasePolicy } from './base.policy';

export class EntityPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Entity";
  }
}
