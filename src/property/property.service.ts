import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindPropertyQueryDto,
  CreatePropertyBodyDto,
  UpdatePropertyBodyDto,
} from './dto';
import { HasMedia } from 'src/@types';
import { FindMediaQueryDto, MediaService } from 'src/media';

@Injectable()
export class PropertyService implements HasMedia {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}
  async create(data: CreatePropertyBodyDto) {
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
    return await this.prisma.property.create({ data });
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
    const aa = await this.prisma.extended.property.paginate({
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
    return await this.prisma.extended.property.paginate({
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
  }

  findOne(id: number) {
    return this.prisma.property.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdatePropertyBodyDto) {
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
    return await this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.property.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async getMediaById(id: number, query: FindMediaQueryDto) {
    return this.media.findAll(query, 'property', id);
  }
  attachMediaForId(id: number, files: Express.Multer.File[]): Promise<void> {
    return this.media.attachMedia(files, 'property', id);
  }

  deleteMedia(mediaId: number): Promise<void> {
    return this.media.deleteMedia(mediaId, 'property');
  }
}
