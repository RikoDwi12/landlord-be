import { Seeder } from "src/seeder";

export class PrepareRestore extends Seeder {
  async run(): Promise<void> {
    console.log('cleaning database');
    await this.truncate('user');
    await this.truncate("group");
    await this.truncate('property');
    await this.truncate('certificate');
    await this.truncate('crm');
    await this.truncate('entity');
    await this.truncate('nop');
    await this.truncate('pbb');
    console.log("DONE")
  }
}
