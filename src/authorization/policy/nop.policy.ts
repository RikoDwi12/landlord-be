import { BasePolicy } from './base.policy';

export class NopPolicy extends BasePolicy {
  protected setup(): void {
    this.model = "Nop";
  }
  taxpayerOption(){
    return this.authorize("read", "Entity")
  }
  subdisctrictOption(){
    return this.authorize("read", "SubDistrict");
  }
  cityOption(){
    return this.authorize("read", "City");
  }
}
