import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { FindNopQueryDto, CreateNopBodyDto, UpdateNopBodyDto } from './dto';
import { ResponseOption } from 'src/@types';
import { dotToObject } from 'src/utils';

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
    const filter: Prisma.NopWhereInput[] = [];
    let search: Prisma.NopWhereInput[] = [];

    /// handle filter
    if (query.taxpayer_id?.length) {
      filter.push({
        taxpayer_id: {
          in: query.taxpayer_id,
        },
      });
    }
    if (query.subdistrict_code?.length) {
      filter.push({
        subdistrict_code: {
          in: query.subdistrict_code,
        },
      });
    }
    if (query.city_code?.length) {
      filter.push({
        subdistrict: {
          district: {
            city_code: {
              in: query.city_code,
            },
          },
        },
      });
    }
    if (typeof query.has_certificate != 'undefined') {
      if (query.has_certificate) {
        filter.push({
          certificate_nops: {
            some: {
              certificate: {
                deleted_at: null,
              },
            },
          },
        });
      } else {
        filter.push({
          certificate_nops: {
            none: {
              certificate: {
                deleted_at: null,
              },
            },
          },
        });
      }
    }

    /// handle search
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
      orderBy: dotToObject(query.orderBy, query.orderDirection),
      include: {
        taxpayer: {
          select: {
            name: true,
          },
        },
        subdistrict: {
          select: {
            name: true,
            district: {
              select: {
                name: true,
                city: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        certificate_nops: {
          select: {
            certificate: {
              // Tambahkan kolom yang dibutuhkan di frontend
              select: {
                type: true,
                no: true,
                location_name: true,
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

  async taxpayerOption(): Promise<ResponseOption> {
    const taxpayers = await this.prisma.entity.findMany({
      where: {
        nop: {
          some: {
            deleted_at: null,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return taxpayers.map((taxpayer) => ({
      label: taxpayer.name,
      value: taxpayer.id.toString(),
    }));
  }
}
