import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateGroupBodyDto,
  FindGroupQueryDto,
  UpdateGroupBodyDto,
} from './dto';
import { PrismaService } from 'src/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateGroupBodyDto) {
    if (
      await this.prisma.group.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException('Group name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.group.create({ data });
  }

  async findAll(query: FindGroupQueryDto) {
    //TODO: short filter search dan pagination

    let filter: Prisma.GroupWhereInput[] = [];
    let search: Prisma.GroupWhereInput[] = [];
    if (query.ids) {
      filter.push({
        id: {
          in: query.ids,
        },
      });
    }
    if (query.search) {
      search = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          properties: {
            some: {
              name: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }
    return await this.prisma.extended.group.paginate({
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
    return this.prisma.group.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateGroupBodyDto) {
    if (
      await this.prisma.group.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException('Group name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.group.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.group.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}