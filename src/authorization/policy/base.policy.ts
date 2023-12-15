import { Policy } from '../policy.abstract';

export class BasePolicy extends Policy {
  create() {
    if(!this.model) return false;
    return this.authorization.ability.can('create', this.model);
  }
  findAll() {
    if(!this.model) return false;
    return this.authorization.ability.can('read', this.model);
  }
  findOne() {
    if(!this.model) return false;
    return this.authorization.ability.can('read', this.model);
  }
  update() {
    if(!this.model) return false;
    return this.authorization.ability.can('update', this.model);
  }
  remove() {
    if(!this.model) return false;
    return this.authorization.ability.can('delete', this.model);
  }
}
