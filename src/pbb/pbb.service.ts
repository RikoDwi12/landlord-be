import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { FindPbbQueryDto, CreatePbbBodyDto, UpdatePbbBodyDto } from './dto';

@Injectable()
export class PbbService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreatePbbBodyDto) {
    if (
      await this.prisma.pbb.findFirst({
        where: { year: data.year, nop_id: data.nop_id, deleted_at: null },
      })
    ) {
      throw new HttpException('Pbb already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.pbb.create({ data });
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
    return await this.prisma.extended.pbb.paginate({
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
  }

  findOne(id: number) {
    return this.prisma.pbb.findFirst({
      where: { id, deleted_at: null },
      include: { nop: { select: { nop: true } } },
    });
  }

  async update(id: number, data: UpdatePbbBodyDto) {
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
    return await this.prisma.pbb.update({ where: { id }, data });
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
