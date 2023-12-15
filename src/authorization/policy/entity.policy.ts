import { BasePolicy } from './base.policy';

export class EntityPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Entity";
  }
  category(){
    return this.authorize("read", "EntityCategory");
  }
  type(){
    return this.authorize("read", "EntityType");
  }
  group(){
    return this.authorize("read", "Group");
  }
}
