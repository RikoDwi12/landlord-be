import { Seeder } from 'src/seeder';
import * as path from 'path';
import { SubDistrict } from '@prisma/client';

interface OldNop {
  id: number;
  nop: string;
  wajib_pajak: string;
  letak_op: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  luas_tanah: string;
  luas_bangunan: string;
  created_at: string;
  updated_at: string;
}
export class NopRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring nops...');
    const oldNops = (
      await import(path.join(process.cwd(), 'raw/landlordv1/nop.json'))
    )
      .find((data: any) => data.type == 'table')
      .data.map(this.fixTypo) as OldNop[];
    const taxPayerNames = [
      ...new Set(oldNops.map((o) => o.wajib_pajak)),
    ].sort();
    await this.truncate('entity');
    await this.prisma.entity.createMany({
      data: taxPayerNames.map((name, index) => ({
        id: index + 1,
        name,
        categories: ['LANDLORD'],
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
          ? 'CV'
          : 'PERORANGAN',
      })),
    });
    const matchedSubdistricts: Record<string, SubDistrict> = {};
    for (const oldNop of oldNops) {
      let subdistrict: SubDistrict | null;
      const catchedSubdistrict =
        matchedSubdistricts[
          `${oldNop.kota}|${oldNop.kecamatan}|${oldNop.kelurahan}`
        ];
      if (catchedSubdistrict) {
        subdistrict = catchedSubdistrict;
      } else {
        subdistrict = await this.prisma.subDistrict.findFirst({
          where: {
            name: {
              contains: oldNop.kelurahan,
              mode: 'insensitive',
            },
            district: {
              name: {
                contains: oldNop.kecamatan,
                mode: 'insensitive',
              },
              city: {
                name: {
                  contains: oldNop.kota,
                  mode: 'insensitive',
                },
              },
            },
          },
          include: {
            district: {
              include: {
                city: true,
              },
            },
          },
        });
        if (!subdistrict) {
          throw new Error(
            'subdistrict not found:' + JSON.stringify(oldNop, null, 2),
          );
        }
        matchedSubdistricts[
          `${oldNop.kota}|${oldNop.kecamatan}|${oldNop.kelurahan}`
        ] = subdistrict as SubDistrict;
      }
    }
    await this.truncate('nop');

    await this.prisma.nop.createMany({
      data: oldNops.map((o) => ({
        id: Number(o.id),
        taxpayer_id:
          taxPayerNames.findIndex((name) => name == o.wajib_pajak) + 1,
        location: o.letak_op,
        land_area: Number(o.luas_tanah),
        building_area: Number(o.luas_bangunan),
        subdistrict_code:
          matchedSubdistricts[`${o.kota}|${o.kecamatan}|${o.kelurahan}`].code,
        created_at: new Date(o.created_at),
        updated_at: new Date(o.updated_at),
        nop: o.nop,
      })),
    });
    console.log('DONE');
  }

  /* ini untuk fix typo yang dilakukan oknum landlord lama */
  private fixTypo(oldNop: OldNop) {
    if (oldNop.kelurahan.toLowerCase() == 'tawang mas')
      oldNop.kelurahan = 'tawangmas';
    if (oldNop.kelurahan.toLowerCase() == 'wonotingal')
      oldNop.kelurahan = 'wonotinggal';
    if (
      ['salaman mloyo', 'solomonmloyo'].includes(oldNop.kelurahan.toLowerCase())
    )
      oldNop.kelurahan = 'salamanmloyo';
    if (oldNop.kelurahan.toLowerCase() == 'tanjungmas')
      oldNop.kelurahan = 'tanjung mas';
    if (oldNop.kelurahan.toLowerCase() == 'gondangdia') {
      oldNop.kecamatan = 'menteng';
    }
    if (oldNop.kelurahan.toLowerCase() == 'pudak payung')
      oldNop.kelurahan = 'pudakpayung';
    if (oldNop.kelurahan.toLowerCase() == 'mugassari')
      oldNop.kelurahan = 'mugasari';
    if (
      oldNop.kecamatan.toLowerCase() == 'tugu' &&
      oldNop.kelurahan.toLowerCase() == 'jrakah'
    )
      oldNop.kelurahan = 'jerakah';
    if (
      oldNop.kecamatan.toLowerCase() == 'ngaliyan' &&
      ['jrakah', 'jerakah'].includes(oldNop.kelurahan.toLowerCase()) &&
      oldNop.letak_op.toLowerCase().includes('perum pandawa village ii')
    )
      oldNop.kelurahan = 'wates'; // TANYA hustler, harusnya perum itu di wates bukan jerakah
    if (
      oldNop.kelurahan.toLowerCase() == 'bandarharjo' &&
      oldNop.letak_op.toLowerCase().includes('jl. mintojiwo raya')
    )
      oldNop.kelurahan = 'gisikdrono'; // TANYA hustler, harusnya jalan tersebut di gisikdrono, bukan bandarharjo
    return oldNop;
  }
}
