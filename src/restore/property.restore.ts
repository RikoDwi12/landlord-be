import { Seeder } from 'src/seeder';
import * as path from 'path';
import { PropertyType } from '@prisma/client';
import { Electricity, SpecificInfo, Water } from 'src/property/property.type';

interface PropertyOld {
  id: number;
  organization_id: string;
  id_sertifikat: string; // harus di JSON.parse
  nama: string;
  tipe: string;
  alamat: string;
  kota: string;
  provinsi: string;
  link_gmap: string;
  tipe_sertifikat: string;
  disewakan: number;
  harga_sewa_bln: string;
  harga_sewa_thn: string;
  dijual: number;
  harga_jual: string;
  luas_tanah: string;
  dimensi: string;
  pic_sewa: string;
  pic_jual: string;
  luas_bangunan: string;
  air: string;
  listrik: string;
  telepon: string;
  blok: string;
  unit: string;
  lantai: string;
  kamar_mandi: number;
  kamar_tidur: number;
  fasilitas: string;
  interior: string;
  garasi: string;
  arah_bangunan: string;
  kondisi_bangunan: string;
  listrik_json: string;
  air_json: string;
  catatan: string;
  estimated_income: string;
  pmg_deskripsi: string;
  created_at: string;
  updated_at: string;
}
export class PropertyRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring properties...');
    const oldProperties = (
      await import(path.join(process.cwd(), 'raw/landlordv1/properti.json'))
    ).find((data: any) => data.type == 'table').data as PropertyOld[];
    await this.prisma.property.createMany({
      data: oldProperties.map((o) => ({
        id: Number(o.id),
        type: o.tipe.toUpperCase() as PropertyType,
        name: o.nama,
        desc: o.pmg_deskripsi,
        address: o.alamat,
        dimension: o.dimensi,
        land_area: Number(o.luas_tanah),
        building_area: Number(o.luas_bangunan),
        sell_price: Number(o.harga_jual),
        lease_price_monthly: Number(o.harga_sewa_bln),
        lease_price_yearly: Number(o.harga_sewa_thn),
        group_id: 1,
        link_gmap: o.link_gmap,
        other_info: o.catatan,
        is_available: true,
        is_leased: Boolean(o.disewakan),
        specific_info: this.restoreSpecificInfo(o),
        created_at: o.created_at,
        updated_at: o.updated_at,
      })),
    });
    console.log('DONE');
  }

  private restoreSpecificInfo(o: PropertyOld): any {
    let waterJson: Water[] = [];
    try {
      // coba ambil dari data json
      waterJson = (
        JSON.parse(o.air_json) as {
          id: string;
          tipe: string;
          customer: string;
        }[]
      ).map((oldWater) => ({
        type: oldWater.tipe.toUpperCase() as any,
        client_number: oldWater.id,
        client_name: oldWater.customer,
      }));
    } catch (e) {
      // jika tidak ada maka ambil dari data air yang masih string
      waterJson = [{ type: o.air.toUpperCase() as any }];
    }
    let electricityJson: Electricity[] = [];
    try {
      // coba ambil dari data json
      electricityJson = (
        JSON.parse(o.listrik_json) as {
          id: string;
          kwh: string;
          tipe: string;
          customer: string;
        }[]
      ).map((oldListrik) => ({
        type: oldListrik.tipe.toUpperCase() as any,
        // get number with regex from kwh
        kwh: Number(oldListrik.kwh.replace(/[^0-9]/g, '')),
        client_name: oldListrik.customer,
        client_number: oldListrik.id,
      }));
    } catch (e) {
      // jika tidak ada maka ambil dari data listrik yang masih string
      electricityJson = [
        {
          type: o.listrik.toLowerCase().includes('pra')
            ? 'PRABAYAR'
            : 'PASCABAYAR',
          kwh: Number(o.listrik.replace(/[^0-9]/g, '')),
        },
      ];
    }
    return {
      water: waterJson,
      unit: Number(o.unit),
      block: o.blok,
      floor: Number(o.lantai),
      phone: Number(o.telepon),
      garage: o.garasi.toLowerCase() == 'ya',
      bedroom: Number(o.kamar_tidur),
      bathroom: Number(o.kamar_mandi),
      interior: o.interior,
      facilities: o.fasilitas,
      electricity: electricityJson,
      parking_area: false,
      building_condition: o.kondisi_bangunan,
      building_direction: o.arah_bangunan.toUpperCase() as any,
    } satisfies SpecificInfo;
  }
}
