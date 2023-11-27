import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Media, MediaTag, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindEntityQueryDto,
  CreateEntityBodyDto,
  UpdateEntityBodyDto,
} from './dto';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';
import { IndonesiaService } from 'src/indonesia/indonesia.service';
import { ResponseOption } from 'src/@types';

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly indo: IndonesiaService,
  ) {}
  async create({ attachments, ...data }: CreateEntityBodyDto, user: User) {
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
    await this.indo.validateCityCode(data.city_code);
    attachments = attachments.filter(
      ({ id }) => typeof id == 'string' && !id.includes('http'),
    );

    return await this.prisma.$transaction(async (trx) => {
      const newEntity = await trx.entity.create({
        data,
      });
      // attach media
      const newAttachments = await this.media.attachMedia(
        trx,
        user,
        attachments,
        {
          mediable_id: newEntity.id,
          mediable_type: Mediable.Entity,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, attachments);
      return {
        ...newEntity,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindEntityQueryDto) {
    const filter: Prisma.EntityWhereInput[] = [];
    let search: Prisma.EntityWhereInput[] = [];
    if (query.type?.length) {
      filter.push({
        type: {
          in: query.type,
        },
      });
    }
    if (query.category?.length) {
      filter.push({
        categories: {
          hasSome: query.category,
        },
      });
    }
    if (query.group_id?.length) {
      filter.push({
        group_id: {
          in: query.group_id,
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
    const res = await this.prisma.extended.entity.paginate({
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
        group: true,
      },
    });
    return {
      ...res,
      hasNextPage: res.hasNextPage,
    };
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
        group: true,
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
    { attachments, ...data }: UpdateEntityBodyDto,
    user: User,
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

    await this.indo.validateCityCode(data.city_code);

    const newAttachmentNames = attachments.filter(
      ({ id }) => typeof id == 'string' && !id.includes('http'),
    );
    const keepAttachments = attachments.filter(({id}) => typeof id == 'number');

    return await this.prisma.$transaction(async (trx) => {
      // upload new attachments
      await this.media.attachMedia(trx, user, newAttachmentNames, {
        mediable_id: id,
        mediable_type: Mediable.Entity,
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
        mediable_type: Mediable.Entity,
      });

      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, newAttachmentNames);

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

  categoryOption(): Promise<ResponseOption> {
    return this.prisma.entityCategory.findMany({
      select: {
        label: true,
        value: true,
      },
    });
  }

  typeOption(): Promise<ResponseOption> {
    return this.prisma.entityType.findMany({
      select: {
        label: true,
        value: true,
      },
    });
  }
  async groupOption(): Promise<ResponseOption> {
    const entityGroups = await this.prisma.group.findMany({
      where: {
        entities: {
          some: {
            deleted_at: null,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return entityGroups.map((x) => ({
      label: x.name,
      value: x.id.toString(),
    }));
  }
}
