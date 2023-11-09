import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Media, MediaTag, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindPropertyQueryDto,
  CreatePropertyBodyDto,
  UpdatePropertyBodyDto,
} from './dto';
import { IndonesiaService } from 'src/indonesia/indonesia.service';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';

@Injectable()
export class PropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly indo: IndonesiaService,
  ) {}
  async create({ attachments, ...data }: CreatePropertyBodyDto, user: User) {
    if (
      await this.prisma.property.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException(
        'Property name already exists',
        HttpStatus.CONFLICT,
      );
    }
    await this.indo.validateCityCode(data.city_code);
    attachments = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    return await this.prisma.$transaction(async (trx) => {
      const newProperty = await trx.property.create({ data });
      const newAttachments = await this.media.attachMedia(
        trx,
        user,
        attachments as string[],
        {
          mediable_id: newProperty.id,
          mediable_type: Mediable.Property,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, attachments as string[]);
      return {
        ...newProperty,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindPropertyQueryDto) {
    let filter: Prisma.PropertyWhereInput[] = [];
    let search: Prisma.PropertyWhereInput[] = [];
    if (query.type?.length) {
      filter.push({
        type: {
          in: query.type,
        },
      });
    }
    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          address: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.property.paginate({
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

  async findOne(id: number) {
    const rows = await this.prisma.property.findFirst({
      where: { id, deleted_at: null },
      include: {
        city: {
          select: {
            province_code: true,
          },
        },
      },
    });
    return {
      ...rows,
      attachments: await this.media.findAll({
        mediable_id: id,
        mediable_type: Mediable.Property,
        tags: [MediaTag.ATTACHMENT],
      }),
    };
  }

  async update(
    id: number,
    { attachments, ...data }: UpdatePropertyBodyDto,
    user: User,
  ) {
    if (
      await this.prisma.property.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException(
        'Property name already exists',
        HttpStatus.CONFLICT,
      );
    }
    await this.indo.validateCityCode(data.city_code);
    const newAttachmentNames = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    const keepAttachments = attachments.filter((x) => typeof x == 'object');
    return await this.prisma.$transaction(async (trx) => {
      // upload new attachments
      await this.media.attachMedia(trx, user, newAttachmentNames as string[], {
        mediable_id: id,
        mediable_type: Mediable.Property,
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
        mediable_type: Mediable.Property,
      });

      return await trx.property
        .update({ where: { id }, data })
        .then(async (property) => {
          return {
            ...property,
            attachments: await this.media.findAll({
              mediable_id: property.id,
              mediable_type: Mediable.Property,
              tags: [MediaTag.ATTACHMENT],
            }),
            trx,
          };
        });
    });
  }

  async remove(id: number) {
    return await this.prisma.property.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
