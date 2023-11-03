import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { FindNopQueryDto, CreateNopBodyDto, UpdateNopBodyDto } from './dto';

@Injectable()
export class NopService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateNopBodyDto) {
    if (
      await this.prisma.nop.findFirst({
        where: { nop: data.nop, deleted_at: null },
      })
    ) {
      throw new HttpException('NOP already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.nop.create({ data });
  }

  async findAll(query: FindNopQueryDto) {
    let filter: Prisma.NopWhereInput[] = [];
    let search: Prisma.NopWhereInput[] = [];
    if (query.taxpayer_id?.length) {
      filter.push({
        taxpayer_id: {
          in: query.taxpayer_id,
        },
      });
    }
    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          nop: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.nop.paginate({
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
    return this.prisma.nop.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateNopBodyDto) {
    if (
      await this.prisma.nop.findFirst({
        where: { nop: data.nop, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException('NOP name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.nop.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.nop.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
