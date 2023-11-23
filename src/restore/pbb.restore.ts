import { Seeder } from '../seeder';
import * as path from 'path';

interface PbbOld {
  id: number;
  organization_id: string;
  nop_id: string;
  tahun: string;
  penanggung: string;
  njop_tanah_m2: string;
  njop_bangunan_m2: string;
  stimulus: string;
  pengkali: string;
  njop_tkp: string;
  tgl_terbayar: string;
  fee: string;
  payment_method: string | null;
  luas_tanah: string | null;
  luas_bangunan: string | null;
  created_at: string;
  updated_at: string;
}
export class PbbRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring pbbs...');
    const oldPbbs = (
      await import(path.join(process.cwd(), 'raw/landlordv1/pbb.json'))
    ).find((data: any) => data.type == 'table').data as PbbOld[];
    const taxPayerNames = [...new Set(oldPbbs.map((o) => o.penanggung))].sort();
    // get data entity yang pernah direstore sebelumnya
    const alreadySavedEntities = await this.prisma.entity.findMany({
      where: {
        name: {
          in: taxPayerNames,
          mode: 'insensitive',
        },
      },
    });
    // nama taxPayer yang belum direstore
    const notSavedTaxpayerNames = taxPayerNames.filter(
      (name) =>
        !alreadySavedEntities
          .map((e) => e.name.toLowerCase())
          .includes(name.toLowerCase()),
    );
    const lastEntityId = (
      await this.prisma.entity.aggregate({
        _max: { id: true },
      })
    )._max.id as number;
    await this.prisma.entity.createMany({
      data: notSavedTaxpayerNames.map((name, index) => ({
        id: index + lastEntityId + 1,
        name,
        categories: ['LANDLORD'],
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
            ? 'CV'
            : 'PERORANGAN',
      })),
    });
    const allEntities = await this.prisma.entity.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    await this.prisma.pbb.createMany({
      data: oldPbbs.map((o) => ({
        id: Number(o.id),
        year: o.tahun.toString(),
        nop_id: Number(o.nop_id),
        stimulus: Number(o.stimulus),
        land_area: Number(o.luas_tanah),
        building_area: Number(o.luas_bangunan),
        njop_land: Number(o.njop_tanah_m2),
        njop_building: Number(o.njop_bangunan_m2),
        njop_no_tax: Number(o.njop_tkp),
        multiplier: Number(o.pengkali),
        taxpayer_id: allEntities.find(
          (e) => e.name.toLowerCase() == o.penanggung.toLowerCase(),
        )?.id as number,
        payment_date: o.tgl_terbayar,
        payment_fee: Number(o.fee),
        payment_method: o.payment_method,
        total_payment: this.calculatePbbTotal(o),
        created_at: o.created_at,
        updated_at: o.updated_at,
      })),
    });

    await this.restoreAutoincrement('entity');
    await this.restoreAutoincrement('pbb');
    console.log('DONE');
  }
  private calculatePbbTotal(oldPbb: PbbOld) {
    const totalNjopTanah =
      Number(oldPbb.njop_tanah_m2) * Number(oldPbb.luas_tanah);
    const totalNjopBangunan =
      Number(oldPbb.njop_bangunan_m2) * Number(oldPbb.luas_bangunan);
    const njopHitung =
      totalNjopTanah + totalNjopBangunan - Number(oldPbb.njop_tkp);
    const pbbHutang = +((Number(oldPbb.pengkali) / 100) * njopHitung);
    return pbbHutang - Number(oldPbb.stimulus) + Number(oldPbb.fee);
  }
}
