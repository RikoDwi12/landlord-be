import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Media, MediaTag, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma';
import { FindPbbQueryDto, CreatePbbBodyDto, UpdatePbbBodyDto } from './dto';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';

@Injectable()
export class PbbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) { }
  async create({ attachments, ...data }: CreatePbbBodyDto, user: User) {
    if (
      await this.prisma.pbb.findFirst({
        where: { year: data.year, nop_id: data.nop_id, deleted_at: null },
      })
    ) {
      throw new HttpException('Pbb already exists', HttpStatus.CONFLICT);
    }
    attachments = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    return this.prisma.$transaction(async (trx) => {
      const newPbb = await trx.pbb.create({ data });
      const newAttachments = await this.media.attachMedia(
        trx,
        user,
        attachments as string[],
        {
          mediable_id: newPbb.id,
          mediable_type: Mediable.PBB,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      return {
        ...newPbb,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindPbbQueryDto) {
    let filter: Prisma.PbbWhereInput[] = [];
    let search: Prisma.PbbWhereInput[] = [];
    if (query.year?.length) {
      filter.push({
        year: {
          in: query.year,
        },
      });
    }
    if (query.nop_id?.length) {
      filter.push({
        nop_id: {
          in: query.nop_id,
        },
      });
    }
    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          nop: {
            nop: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    const res = await this.prisma.extended.pbb.paginate({
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
      include: {
        nop: {
          select: {
            nop: true,
          },
        },
      },
    });
    return {
      ...res,
      hasNextPage: res.hasNextPage,
    };
  }

  findOne(id: number) {
    return this.prisma.pbb.findFirst({
      where: { id, deleted_at: null },
      include: { nop: { select: { nop: true } } },
    });
  }

  async update(
    id: number,
    { attachments, ...data }: UpdatePbbBodyDto,
    user: User,
  ) {
    if (
      await this.prisma.pbb.findFirst({
        where: {
          year: data.year,
          nop_id: data.nop_id,
          id: { not: id },
          deleted_at: null,
        },
      })
    ) {
      throw new HttpException('Pbb already exists', HttpStatus.CONFLICT);
    }

    const newAttachmentNames = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    const keepAttachments = attachments.filter((x) => typeof x == 'object');
    return this.prisma.$transaction(async (trx) => {
      // upload new attachments
      await this.media.attachMedia(trx, user, newAttachmentNames as string[], {
        mediable_id: id,
        mediable_type: Mediable.PBB,
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
        mediable_type: Mediable.PBB,
      });

      return await trx.pbb.update({ where: { id }, data }).then(async (pbb) => {
        return {
          ...pbb,
          attachments: await this.media.findAll({
            mediable_id: pbb.id,
            mediable_type: Mediable.PBB,
            tags: [MediaTag.ATTACHMENT],
          }),
          trx,
        };
      });
    });
  }

  async remove(id: number) {
    return await this.prisma.pbb.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
