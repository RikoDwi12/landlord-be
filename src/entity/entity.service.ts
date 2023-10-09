import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateEntityBodyDto } from './dto/update-entity.dto';
import { Prisma } from '@prisma/client';
import { FindEntityQueryDto } from './dto/find-entity.dto';
import { PrismaService } from 'src/prisma';
import { CreateEntityBodyDto } from './dto/create-entity.dto';

@Injectable()
export class EntityService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateEntityBodyDto) {
    if (
      await this.prisma.entity.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException('Entity name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.entity.create({ data });
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
    });
  }

  findOne(id: number) {
    return this.prisma.entity.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateEntityBodyDto) {
    if (
      await this.prisma.entity.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException('Entity name already exists', HttpStatus.CONFLICT);
    }
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
}
