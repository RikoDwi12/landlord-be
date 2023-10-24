import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Entity, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindEntityQueryDto,
  CreateEntityBodyDto,
  UpdateEntityBodyDto,
} from './dto';
import { constToOption } from '../utils/option';
import { ENTITY_CATEGORIES, ENTITY_TYPES } from './entity.const';
import { MediaService, FindMediaQueryDto } from 'src/media';
import type { HasMedia } from 'src/@types';

@Injectable()
export class EntityService implements HasMedia<Entity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) { }
  async create({ group_ids, ...data }: CreateEntityBodyDto) {
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
    const newEntity = await this.prisma.entity.create({
      data,
    });

    // connect group id
    await this.prisma.entityGroup.createMany({
      data:
        group_ids?.map((group_id) => ({
          group_id,
          entity_id: newEntity.id,
        })) || [],
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

  findOne(id: number) {
    return this.prisma.entity.findFirst({
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
  }

  async update(id: number, data: UpdateEntityBodyDto) {
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
    const groupIds = data.group_ids || [];
    delete data.group_ids;

    // delete old connected group
    await this.prisma.entityGroup.deleteMany({
      where: {
        entity_id: id,
      },
    });
    // create new pivot
    await this.prisma.entityGroup.updateMany({
      data: groupIds.map((group_id) => ({
        group_id,
        entity_id: id,
      })),
    });
    return await this.prisma.entity.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.entity.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getMediaById(id: number, query: FindMediaQueryDto) {
    return await this.media.findAll(query, 'entity', id);
  }
  async attachMediaForId(
    id: number,
    files: Express.Multer.File[],
  ): Promise<any> {
    console.log({ id, files });
  }

  categoryOption() {
    return constToOption(ENTITY_CATEGORIES);
  }

  typeOption() {
    return constToOption(ENTITY_TYPES);
  }
}
