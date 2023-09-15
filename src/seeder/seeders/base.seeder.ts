import { IndonesiaSeeder } from './indonesia.seeder';
import { Seeder } from 'src/seeder/seeder.abstract';

export class BaseSeeder extends Seeder {
  async run() {
    await this.call(IndonesiaSeeder);
  }
}
