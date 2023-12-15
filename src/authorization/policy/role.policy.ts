import { BasePolicy } from './base.policy';

export class RolePolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Role";
  }

  allPermission(){
    return this.authorization.ability.can("read", "Role")
  }
}
