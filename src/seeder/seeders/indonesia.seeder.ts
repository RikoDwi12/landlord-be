import { Seeder } from 'src/seeder/seeder.abstract';
import * as path from 'path';
import { gunzipSync } from 'zlib';
import * as fs from 'fs';

export class IndonesiaSeeder extends Seeder {
  async run(): Promise<void> {
    await this.seedProvinces();
    await this.seedCities();
  }

  protected async seedProvinces() {
    type ProvinceRaw = [
      code: string,
      name: string,
      latitude: string,
      longitude: string,
    ];
    const content = gunzipSync(
      fs.readFileSync(path.join(process.cwd(), 'raw/provinces.csv.gz')),
    );
    const provinces = this.csvToArray(content.toString()) as ProvinceRaw[];
    await this.truncate('province');
    await this.prisma.province.createMany({
      data: provinces
        .map((row) => ({
          code: row[0],
          name: row[1],
          latitude: row[2],
          longitude: row[3],
        }))
        .filter((p) => !!p.code),
    });
  }

  protected async seedCities() {
    type CityRaw = [
      code: string,
      province_code: string,
      name: string,
      latitude: string,
      longitude: string,
    ];
    const content = gunzipSync(
      fs.readFileSync(path.join(process.cwd(), 'raw/cities.csv.gz')),
    );
    const cities = this.csvToArray(content.toString()) as CityRaw[];
    await this.truncate('city');
    await this.prisma.city.createMany({
      data: cities
        .map((row) => ({
          code: row[0],
          province_code: row[1],
          name: row[2],
          latitude: row[3],
          longitude: row[4],
        }))
        .filter((p) => !!p.code),
    });
  }

  protected csvToArray(csv: string) {
    return csv.split('\n').map((row) => row.split(','));
  }
}
