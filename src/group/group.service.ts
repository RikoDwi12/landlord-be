import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateGroupBodyDto,
  FindGroupQueryDto,
  UpdateGroupBodyDto,
} from './dto';
import { PrismaService } from '../prisma';
import { Prisma } from '@prisma/client';
import { dotToObject } from 'src/utils';
import { ResponseOption } from 'src/@types';
import { group } from 'console';

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

    const filter: Prisma.GroupWhereInput[] = [];
    let search: Prisma.GroupWhereInput[] = [];
    if (query.id) {
      filter.push({
        id: {
          in: query.id,
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
    const res = await this.prisma.extended.group.paginate({
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
      orderBy: dotToObject(query.orderBy, query.orderDirection),
      include: {
        // dibutuhkan di FE untuk menampilkan jumlah entity
        _count: {
          select: {
            entities: {
              where: {
                deleted_at: null,
              },
            },
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
    return this.prisma.group.findFirst({
      where: { id, deleted_at: null },
    });
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

  async option(): Promise<ResponseOption> {
    const groups = await this.prisma.group.findMany({
      select: {
        name: true,
        id: true,
      },
      where: {
        deleted_at: null,
      },
    });
    return groups.map((group) => ({
      label: group.name,
      value: group.id.toString(),
    }));
  }
}
