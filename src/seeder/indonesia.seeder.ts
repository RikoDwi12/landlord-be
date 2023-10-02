import { Seeder } from './seeder.abstract';
import * as path from 'path';
import { gunzipSync } from 'zlib';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export class IndonesiaSeeder extends Seeder {
  async run(): Promise<void> {
    await this.seedProvinces();
    await this.seedCities();
    await this.seedDistricts();
    await this.seedSubDistricts();
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

  protected async seedDistricts() {
    type DistrictRaw = [
      code: string,
      city_code: string,
      name: string,
      latitude: string,
      longitude: string,
    ];
    const content = gunzipSync(
      fs.readFileSync(path.join(process.cwd(), 'raw/districts.csv.gz')),
    );
    const districts = this.csvToArray(content.toString()) as DistrictRaw[];
    await this.truncate('district');
    await this.prisma.district.createMany({
      data: districts
        .map((row) => ({
          code: row[0],
          city_code: row[1],
          name: row[2],
          latitude: row[3],
          longitude: row[4],
        }))
        .filter((p) => !!p.code),
    });
  }

  protected async seedSubDistricts() {
    type SubDistrictRaw = [
      code: string,
      district_code: string,
      name: string,
      latitude: string,
      longitude: string,
    ];

    await this.truncate('subDistrict');
    const subDistrictsQueries = (
      trx: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) =>
      fs
        .readdirSync(path.join(process.cwd(), 'raw/subdistricts'))
        .map((file) => {
          const content = gunzipSync(
            fs.readFileSync(path.join(process.cwd(), 'raw/subdistricts', file)),
          );
          const subDistricts = this.csvToArray(
            content.toString(),
          ) as SubDistrictRaw[];
          return trx.subDistrict.createMany({
            data: subDistricts
              .map((row) => ({
                code: row[0],
                district_code: row[1],
                name: row[2],
                latitude: row[3],
                longitude: row[4],
              }))
              .filter((p) => !!p.code),
          });
        });
    await this.prisma.$transaction(
      (trx) => Promise.all(subDistrictsQueries(trx)),
      {
        timeout: 10000,
      },
    );
  }

  protected csvToArray(csv: string) {
    return csv.split('\n').map((row) => row.split(','));
  }
}
