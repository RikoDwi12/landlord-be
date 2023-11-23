import { Seeder } from '../seeder';
import * as path from 'path';
import {
  CertificateStatus,
  CertificateType,
  SubDistrict,
} from '@prisma/client';

interface CertificateOld {
  id: number;
  grup: string;
  nop: string; // must be parsed to array
  tipe: string;
  tipe_no: string;
  nama: string;
  pemilik: string;
  kepemilikan_status?: string;
  operator: string;
  fungsi: string;
  nama_lokasi: string;
  catatan: string;
  arsip_asli: string;
  arsip_dokumen: string;
  arsip_salinan_no: string;
  arsip_salinan_nama: string;
  ajb_notaris: string;
  ajb_nomor: string;
  ajb_tanggal: string;
  ajb_nominal: string;
  luas: number;
  tgl_terbit: string;
  tgl_berakhir: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  silsilah: string; // must be parsed to array
  dokumen: string; // must be parsed to array
  koordinat: string; // must be parsed to array
  nonactive: number;
  nonactive_desc: string | null;
  created_at: string;
  updated_at: string;
}
export class CertificateRestore extends Seeder {
  async run(): Promise<void> {
    console.log('restoring certificates...');
    const oldCertificates = (
      await import(path.join(process.cwd(), 'raw/landlordv1/sertifikat.json'))
    ).find((data: any) => data.type == 'table').data as CertificateOld[];

    const groupNames = [...new Set(oldCertificates.map((o) => o.grup))].sort();
    await this.prisma.group.createMany({
      data: groupNames.map((o) => ({
        name: o,
      })),
    });
    const notaryNames = [
      ...new Set(oldCertificates.map((o) => o.ajb_notaris)),
    ].sort();
    const alreadySavedNotaries = await this.prisma.entity.findMany({
      where: {
        name: {
          in: notaryNames,
          mode: 'insensitive',
        },
      },
    });
    // tambahkan kategori NOTARIS ke entity yang sudah tersimpan sebelumnya
    await this.prisma.entity.updateMany({
      where: {
        id: {
          in: alreadySavedNotaries.map((o) => o.id),
        },
      },
      data: {
        categories: {
          push: 'NOTARIS',
        },
      },
    });
    const notSavedNotaryNames = notaryNames.filter(
      (name) =>
        !alreadySavedNotaries
          .map((e) => e.name.toLowerCase())
          .includes(name.toLowerCase()),
    );
    // save notaris baru ke entity
    await this.prisma.entity.createMany({
      data: notSavedNotaryNames.map((name, index) => ({
        name: name,
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
            ? 'CV'
            : 'PERORANGAN',
        categories: ['NOTARIS'],
      })),
    });
    const notaryEntities = await this.prisma.entity.findMany({
      where: {
        categories: {
          has: 'NOTARIS',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const ownerNames = [
      ...new Set(oldCertificates.map((o) => o.pemilik)),
    ].sort();
    const alreadySavedOwners = await this.prisma.entity.findMany({
      where: {
        name: {
          in: ownerNames,
          mode: 'insensitive',
        },
      },
    });
    // tambahkan kategori LANDLORD ke entity yang sudah tersimpan sebelumnya
    await this.prisma.entity.updateMany({
      where: {
        id: {
          in: alreadySavedOwners.map((o) => o.id),
        },
      },
      data: {
        categories: {
          push: 'LANDLORD',
        },
      },
    });
    const notSavedOwnerNames = ownerNames.filter(
      (name) =>
        !alreadySavedOwners
          .map((e) => e.name.toLowerCase())
          .includes(name.toLowerCase()),
    );
    // save owner baru ke entity
    await this.prisma.entity.createMany({
      data: notSavedOwnerNames.map((name, index) => ({
        name: name,
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
            ? 'CV'
            : 'PERORANGAN',
        categories: ['LANDLORD'],
      })),
    });
    const ownerEntities = await this.prisma.entity.findMany({
      where: {
        categories: {
          has: 'LANDLORD',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const behalfofNames = [
      ...new Set(oldCertificates.map((o) => o.nama)),
    ].sort();
    const alreadySavedBehalfofs = await this.prisma.entity.findMany({
      where: {
        name: {
          in: behalfofNames,
          mode: 'insensitive',
        },
      },
    });
    // tambahkan kategori LANDLORD ke entity yang sudah tersimpan sebelumnya
    await this.prisma.entity.updateMany({
      where: {
        id: {
          in: alreadySavedBehalfofs.map((o) => o.id),
        },
      },
      data: {
        categories: {
          push: 'LANDLORD',
        },
      },
    });
    const notSavedBehalfofNames = behalfofNames.filter(
      (name) =>
        !alreadySavedBehalfofs
          .map((e) => e.name.toLowerCase())
          .includes(name.toLowerCase()),
    );
    // save behalof baru ke entity
    await this.prisma.entity.createMany({
      data: notSavedBehalfofNames.map((name, index) => ({
        name: name,
        type: name.toUpperCase().includes('PT')
          ? 'PT'
          : name.toUpperCase().includes('CV')
            ? 'CV'
            : 'PERORANGAN',
        categories: ['LANDLORD'],
      })),
    });
    const behalofEntities = await this.prisma.entity.findMany({
      where: {
        categories: {
          has: 'LANDLORD',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const matchedSubdistricts: Record<string, SubDistrict> = {};
    for (const oldCertificate of oldCertificates) {
      let subdistrict: SubDistrict | null;
      const cachedSubdistrict =
        matchedSubdistricts[
        `${oldCertificate.kota}|${oldCertificate.kecamatan}|${oldCertificate.kelurahan}`
        ];
      if (cachedSubdistrict) {
        subdistrict = cachedSubdistrict;
      } else {
        subdistrict = await this.prisma.subDistrict.findFirst({
          where: {
            name: {
              contains: oldCertificate.kelurahan,
              mode: 'insensitive',
            },
            district: {
              name: {
                contains: oldCertificate.kecamatan,
                mode: 'insensitive',
              },
              city: {
                name: {
                  contains: oldCertificate.kota,
                  mode: 'insensitive',
                },
              },
            },
          },
        });
        if (!subdistrict) {
          throw new Error(
            'subdistrict not found:' + JSON.stringify(oldCertificate, null, 2),
          );
        }
        matchedSubdistricts[
          `${oldCertificate.kota}|${oldCertificate.kecamatan}|${oldCertificate.kelurahan}`
        ] = subdistrict as SubDistrict;
      }
    }
    await this.prisma.certificate.createMany({
      data: oldCertificates.map((o) => ({
        id: Number(o.id),
        group_id: groupNames.indexOf(o.grup) + 1,
        type: o.tipe.toUpperCase() as CertificateType,
        no: o.tipe_no,
        ajb_no: o.ajb_nomor,
        ajb_notary_id: notaryEntities.find((e) => e.name == o.ajb_notaris)
          ?.id as number,
        ajb_date: new Date(o.ajb_tanggal),
        ajb_total: Number(o.ajb_nominal),
        address: o.alamat,
        land_area: Number(o.luas),
        functional: o.fungsi,
        other_info: o.catatan,
        location_name: o.nama_lokasi,
        publish_date: new Date(o.tgl_terbit),
        expired_date: new Date(o.tgl_berakhir),
        copy_archive: o.arsip_salinan_nama,
        no_copy_archive: o.arsip_salinan_no,
        original_doc: o.arsip_dokumen,
        original_cert: o.arsip_asli,
        ownership_status:
          o.kepemilikan_status?.toUpperCase() as CertificateStatus,
        owner_id: ownerEntities.find((e) => e.name == o.pemilik)?.id as number,
        behalf_of_id: behalofEntities.find((e) => e.name == o.nama)
          ?.id as number,
        subdistrict_code:
          matchedSubdistricts[`${o.kota}|${o.kecamatan}|${o.kelurahan}`].code,
        document_activities: this.restoreSilsilah(o),
        documents: this.restoreDocument(o),
        created_at: new Date(o.created_at),
        updated_at: new Date(o.updated_at),
      })),
    });

    // attach nop ke sertifikat
    for (const oldCertificate of oldCertificates) {
      let nopKeys: string[] = [];
      try {
        nopKeys = JSON.parse(oldCertificate.nop);
      } catch (e) {
        //pass
      }
      if (nopKeys.length > 0) {
        const nops = await this.prisma.nop.findMany({
          where: {
            nop: {
              in: nopKeys,
            },
          },
          select: { id: true },
        });
        await this.prisma.certificateNop.createMany({
          data: nops.map(({ id }) => ({
            nop_id: Number(id),
            certificate_id: Number(oldCertificate.id),
          })),
        });
      }
    }
    await this.restoreAutoincrement('certificate');
    console.log('DONE');
  }

  private restoreSilsilah(o: CertificateOld) {
    let documentActivities: {
      pic: string;
      document: string;
      date?: Date;
      activity: string;
    }[] = [];
    const parsedSilsilah = JSON.parse(o.silsilah);
    if (!Array.isArray(parsedSilsilah)) {
      throw new Error(
        'silsilah is not an array: ' + JSON.stringify(o, null, 2),
      );
    }
    for (const silsilah of parsedSilsilah) {
      // tipe data silsilah ada dua macam
      // tipe yang baru ada pic, tanggal, dokumen, dan keperluan
      if (Object.keys(silsilah).includes('pic')) {
        documentActivities.push({
          pic: silsilah.pic,
          document: silsilah.dokumen,
          date: new Date(silsilah.tanggal),
          activity: silsilah.keperluan,
        });
      } else {
        // tipe yang lama ada tanggal_keluar, dokumen, nama, keperluan, tanggal_masuk, nama, keterangan
        // kita split jadi dua data
        documentActivities.push({
          pic: silsilah.nama,
          document: silsilah.dokumen,
          date: silsilah.tanggal_keluar
            ? new Date(silsilah.tanggal_keluar)
            : undefined,
          activity: silsilah.keperluan,
        });
        documentActivities.push({
          pic: silsilah.nama,
          document: silsilah.dokumen,
          date: silsilah.tanggal_masuk
            ? new Date(silsilah.tanggal_masuk)
            : undefined,
          activity: silsilah.keterangan,
        });
      }
    }
    return documentActivities;
  }

  private restoreDocument(o: CertificateOld) {
    let documents: {
      document: string;
    }[] = [];
    const parsedDokumen = JSON.parse(o.dokumen);
    if (!Array.isArray(parsedDokumen)) {
      throw new Error('dokumen is not an array: ' + JSON.stringify(o, null, 2));
    }
    for (const dokumen of parsedDokumen) {
      documents.push({
        document: dokumen.dokumen,
      });
    }
    return documents;
  }
}
