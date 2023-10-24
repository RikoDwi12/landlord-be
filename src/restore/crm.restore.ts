import { Seeder } from '../seeder';
import * as path from 'path';

interface OldCrm {
  id: number;
  organizatian_id: string;
  id_properti: number;
  nama: string;
  perusahaan: string;
  telepon: string;
  email: string;
  tanggal: string;
  catatan: string;
  created_at: string;
  updated_at: string;
}
export class CrmRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring crms...');
    const oldCrms = (
      await import(path.join(process.cwd(), 'raw/landlordv1/crm.json'))
    ).find((data: any) => data.type == 'table').data as OldCrm[];
    const prospectNames = [
      ...new Set(oldCrms.map((data) => data.perusahaan)),
    ].sort();
    const alreadySavedProspects = await this.prisma.entity.findMany({
      where: {
        name: {
          in: prospectNames,
          mode: 'insensitive',
        },
      },
    });
    // tambahkan kategori CLIENT di prospect entity dan data contact
    for (const prospect of alreadySavedProspects) {
      await this.prisma.entity.update({
        where: {
          id: prospect.id,
        },
        data: {
          categories: {
            push: 'CLIENT',
          },
          contact_name: oldCrms.find(
            (o) => o.perusahaan.toLowerCase() == prospect.name.toLowerCase(),
          )?.nama,
          email: oldCrms.find(
            (o) => o.perusahaan.toLowerCase() == prospect.name.toLowerCase(),
          )?.email,
          phone: oldCrms.find(
            (o) => o.perusahaan.toLowerCase() == prospect.name.toLowerCase(),
          )?.telepon,
          contact_phone: oldCrms.find(
            (o) => o.perusahaan.toLowerCase() == prospect.name.toLowerCase(),
          )?.telepon,
        },
      });
    }

    const notSavedProspectNames = prospectNames.filter(
      (name) =>
        !alreadySavedProspects
          .map((e) => e.name.toLowerCase())
          .includes(name.toLowerCase()),
    );
    // simpan entity prospects
    await this.prisma.entity.createMany({
      data: notSavedProspectNames.map((name) => ({
        name: name,
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
            ? 'CV'
            : 'PERORANGAN',
        categories: ['CLIENT'],
        phone: oldCrms.find(
          (o) => o.perusahaan.toLowerCase() == name.toLowerCase(),
        )?.telepon,
        email: oldCrms.find(
          (o) => o.perusahaan.toLowerCase() == name.toLowerCase(),
        )?.email,
        contact_name: oldCrms.find(
          (o) => o.perusahaan.toLowerCase() == name.toLowerCase(),
        )?.nama,
        contact_phone: oldCrms.find(
          (o) => o.perusahaan.toLowerCase() == name.toLowerCase(),
        )?.telepon,
      })),
    });
    const prospectEntities = await this.prisma.entity.findMany({
      where: {
        categories: {
          has: 'CLIENT',
        },
      },
    });

    await this.truncate('crm');
    await this.prisma.crm.createMany({
      data: oldCrms.map((o) => ({
        date: new Date(o.tanggal),
        property_id: Number(o.id_properti),
        prospect_client_id: prospectEntities.find(
          (e) => e.name.toLowerCase() == o.perusahaan.toLowerCase(),
        )?.id,
        // TODO: pic di data lama belum ada?
        prospect_desc: o.catatan,
      })),
    });
    console.log('DONE');
  }
}
