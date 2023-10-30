import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Entity, Media, MediaTag, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindEntityQueryDto,
  CreateEntityBodyDto,
  UpdateEntityBodyDto,
} from './dto';
import { constToOption } from '../utils/option';
import { ENTITY_CATEGORIES, ENTITY_TYPES } from './entity.const';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}
  async create(
    { group_ids, attachments, ...data }: CreateEntityBodyDto,
    userId: number,
  ) {
    if (
      await this.prisma.entity.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException(
        'Entity name already exists',
        HttpStatus.CONFLICT,
      );
    }
    await this.makeSureValidCityCode(data.city_code);
    attachments = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );

    return await this.prisma.$transaction(async (trx) => {
      const newEntity = await trx.entity.create({
        data,
      });
      // connect group id
      await trx.entityGroup.createMany({
        data:
          group_ids?.map((group_id) => ({
            group_id,
            entity_id: newEntity.id,
          })) || [],
      });
      // attach media
      const newAttachments = await this.media.attachMedia(
        trx,
        userId,
        attachments as string[],
        {
          mediable_id: newEntity.id,
          mediable_type: Mediable.Entity,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(userId, attachments as string[]);
      return {
        ...newEntity,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindEntityQueryDto) {
    let filter: Prisma.EntityWhereInput[] = [];
    let search: Prisma.EntityWhereInput[] = [];
    if (query.type?.length) {
      filter.push({
        type: {
          in: query.type,
        },
      });
    }
    if (query.categories?.length) {
      filter.push({
        categories: {
          hasSome: query.categories,
        },
      });
    }
    if (query.group_id?.length) {
      filter.push({
        entity_groups: {
          some: {
            group_id: {
              in: query.group_id,
            },
          },
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
          email: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    return await this.prisma.extended.entity.paginate({
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
        entity_groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const rows = await this.prisma.entity.findFirst({
      where: { id, deleted_at: null },
      include: {
        city: {
          select: {
            province_code: true,
          },
        },
        entity_groups: {
          select: {
            group_id: true,
          },
        },
      },
    });
    return {
      ...rows,
      attachments: await this.media.findAll({
        mediable_id: id,
        mediable_type: Mediable.Entity,
        tags: [MediaTag.ATTACHMENT],
      }),
    };
  }

  async update(
    id: number,
    { group_ids, attachments, ...data }: UpdateEntityBodyDto,
    userId: number,
  ) {
    if (
      await this.prisma.entity.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException(
        'Entity name already exists',
        HttpStatus.CONFLICT,
      );
    }

    await this.makeSureValidCityCode(data.city_code);

    const newAttachmentNames = attachments.filter(
      (x) => typeof x == 'string' && !x.includes('http'),
    );
    const keepAttachments = attachments.filter((x) => typeof x == 'object');

    return await this.prisma.$transaction(async (trx) => {
      // upload new attachments
      await this.media.attachMedia(
        trx,
        userId,
        newAttachmentNames as string[],
        {
          mediable_id: id,
          mediable_type: Mediable.Entity,
          tags: [MediaTag.ATTACHMENT],
        },
      );

      // remove attachment yang tidak dikeep
      const deletedAttachments = await trx.media.findMany({
        where: {
          id: {
            notIn: keepAttachments.map((x) => (x as Media).id),
          },
        },
      });
      await this.media.deleteMedia(trx, deletedAttachments, {
        mediable_type: Mediable.Entity,
      });

      // delete old connected group
      await trx.entityGroup.deleteMany({
        where: {
          entity_id: id,
        },
      });
      // create new pivot
      await trx.entityGroup.createMany({
        data:
          group_ids?.map((group_id) => ({
            group_id,
            entity_id: id,
          })) || [],
      });
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(userId, newAttachmentNames as string[]);

      // return result with new attachments
      return await trx.entity
        .update({ where: { id }, data })
        .then(async (entity) => {
          return {
            ...entity,
            attachments: await this.media.findAll(
              {
                tags: [MediaTag.ATTACHMENT],
                mediable_id: id,
                mediable_type: Mediable.Entity,
              },
              trx,
            ),
          };
        });
    });
  }

  async remove(id: number) {
    return await this.prisma.entity.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  categoryOption() {
    return constToOption(ENTITY_CATEGORIES);
  }

  typeOption() {
    return constToOption(ENTITY_TYPES);
  }
  private async makeSureValidCityCode(city_code?: string) {
    if (!city_code) return;
    if (
      !(await this.prisma.city.findFirst({
        where: { code: city_code },
      }))
    ) {
      throw new HttpException('City code not found', HttpStatus.NOT_FOUND);
    }
  }
}
