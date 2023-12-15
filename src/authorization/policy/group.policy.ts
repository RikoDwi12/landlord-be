import { BasePolicy } from './base.policy';

export class GroupPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Group";
  }
  option(){
    return this.authorize("read", "Group");
  }
}
