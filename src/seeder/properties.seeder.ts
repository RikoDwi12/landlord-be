import { Seeder } from './seeder.abstract';

export class PropertiesSeeder extends Seeder {
  async run(): Promise<void> {
    await this.truncate('property');
    await this.prisma.property.createMany({
      data: [
        {
          name: 'properti 1',
          type: 'TANAH',
          address: 'alamat properti 1',
          land_area: 100,
          building_area: 100,
          dimension: '100 x 100',
          lease_price_monthly: 1000000,
          lease_price_yearly: 100000000,
          sell_price: 1000000000,
          is_available: true,
        },
        {
          name: 'properti 2',
          type: 'GEDUNG',
          address: 'alamat properti 2',
          land_area: 200,
          building_area: 200,
          dimension: '200 x 200',
          lease_price_monthly: 2000000,
          lease_price_yearly: 200000000,
          sell_price: 2000000000,
          is_available: true,
        },
        {
          name: 'properti 3',
          type: 'GUDANG',
          address: 'alamat properti 3',
          land_area: 300,
          building_area: 300,
          dimension: '300 x 300',
          lease_price_monthly: 3000000,
          lease_price_yearly: 300000000,
          sell_price: 3000000000,
          is_available: true,
        },
        {
          name: 'properti 4',
          type: 'PABRIK',
          address: 'alamat properti 4',
          land_area: 400,
          building_area: 400,
          dimension: '400 x 400',
          lease_price_monthly: 4000000,
          lease_price_yearly: 400000000,
          sell_price: 4000000000,
          is_available: true,
        },
      ],
    });
  }
}
