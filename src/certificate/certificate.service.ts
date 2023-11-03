import { Injectable } from '@nestjs/common';
import { Media, MediaTag, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindCertificateQueryDto,
  CreateCertificateBodyDto,
  UpdateCertificateBodyDto,
} from './dto';
import { IndonesiaService } from 'src/indonesia/indonesia.service';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';

@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly indo: IndonesiaService,
    private readonly media: MediaService,
  ) { }
  async create({ attachments, ...data }: CreateCertificateBodyDto, user: User) {
    await this.indo.validateSubDistrictCode(data.subdistrict_code);
    attachments = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    return await this.prisma.$transaction(async (trx) => {
      const newCertificate = await trx.certificate.create({ data });
      const newAttachments = await this.media.attachMedia(
        trx,
        user,
        attachments as string[],
        {
          mediable_id: newCertificate.id,
          mediable_type: Mediable.Certificate,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, attachments as string[]);
      return {
        ...newCertificate,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindCertificateQueryDto) {
    let filter: Prisma.CertificateWhereInput[] = [];
    let search: Prisma.CertificateWhereInput[] = [];
    if (query.type?.length) {
      filter.push({
        type: {
          in: query.type,
        },
      });
    }
    if (query.status?.length) {
      filter.push({
        ownership_status: {
          in: query.status,
        },
      });
    }

    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          ajb_no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.certificate.paginate({
      limit: query.limit || 10,
      page: query.page,
      where: {
        deleted_at: null,
        AND: [
          ...filter,
          {
            OR: search,
          },
        ],
      },
      orderBy: {
        [query.orderBy]: query.orderDirection,
      },
    });
    return {
      ...res,
      hasNextPage: res.hasNextPage,
    };
  }

  findOne(id: number) {
    return this.prisma.certificate.findFirst({
      where: { id, deleted_at: null },
    });
  }

  async update(
    id: number,
    { attachments, ...data }: UpdateCertificateBodyDto,
    user: User,
  ) {
    await this.indo.validateSubDistrictCode(data.subdistrict_code);
    const newAttachmentNames = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    const keepAttachments = attachments.filter((x) => typeof x == 'object');
    return this.prisma.$transaction(async (trx) => {
      // upload new attachments
      await this.media.attachMedia(trx, user, newAttachmentNames as string[], {
        mediable_id: id,
        mediable_type: Mediable.Certificate,
        tags: [MediaTag.ATTACHMENT],
      });

      // remove attachment yang tidak dikeep
      const deletedAttachments = await trx.media.findMany({
        where: {
          id: {
            notIn: keepAttachments.map((x) => (x as Media).id),
          },
        },
      });
      await this.media.deleteMedia(trx, deletedAttachments, {
        mediable_type: Mediable.Certificate,
      });

      return await trx.certificate
        .update({ where: { id }, data })
        .then(async (certificate) => {
          return {
            ...certificate,
            attachments: await this.media.findAll({
              mediable_id: certificate.id,
              mediable_type: Mediable.Certificate,
              tags: [MediaTag.ATTACHMENT],
            }),
            trx,
          };
        });
    });
  }

  async remove(id: number) {
    return await this.prisma.certificate.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
