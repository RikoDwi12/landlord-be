import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { FindCrmQueryDto, CreateCrmBodyDto, UpdateCrmBodyDto } from './dto';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateCrmBodyDto) {
    // if (
    //   await this.prisma.crm.findFirst({
    //     where: { deleted_at: null },
    //   })
    // ) {
    //   throw new HttpException(
    //     'Crm name already exists',
    //     HttpStatus.CONFLICT,
    //   );
    // }
    return await this.prisma.crm.create({ data });
  }

  async findAll(query: FindCrmQueryDto) {
    let filter: Prisma.CrmWhereInput[] = [];
    let search: Prisma.CrmWhereInput[] = [];

    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          prospect_desc: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.crm.paginate({
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
    return this.prisma.crm.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateCrmBodyDto) {
    // if (
    //   await this.prisma.crm.findFirst({
    //     where: { name: data.name, id: { not: id }, deleted_at: null },
    //   })
    // ) {
    //   throw new HttpException(
    //     'Crm name already exists',
    //     HttpStatus.CONFLICT,
    //   );
    // }
    return await this.prisma.crm.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.crm.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
