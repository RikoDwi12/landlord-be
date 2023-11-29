import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { FindCrmQueryDto, CreateCrmBodyDto, UpdateCrmBodyDto } from './dto';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCrmBodyDto) {
    return await this.prisma.crm.create({ data });
  }

  async findAll(query: FindCrmQueryDto) {
    const filter: Prisma.CrmWhereInput[] = [];
    let search: Prisma.CrmWhereInput[] = [];

    // handle filter
    if (query.prospect_client_id?.length) {
      filter.push({
        prospect_client_id: {
          in: query.prospect_client_id,
        },
      });
    }

    // handle search
    if (query.search) {
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
      include: {
        prospect_client: {
          select: {
            name: true,
          },
        },
        property: {
          select: {
            type: true,
            name: true,
            specific_info: true,
            address: true,
            city: {
              select: {
                name: true,
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
    return this.prisma.crm.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateCrmBodyDto) {
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
