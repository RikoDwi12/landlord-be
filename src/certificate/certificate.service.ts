import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import {
  FindCertificateQueryDto,
  CreateCertificateBodyDto,
  UpdateCertificateBodyDto,
} from './dto';

@Injectable()
export class CertificateService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateCertificateBodyDto) {
    // if (
    //   await this.prisma.certificate.findFirst({
    //     where: { name: data.name, deleted_at: null },
    //   })
    // ) {
    //   throw new HttpException(
    //     'Certificate name already exists',
    //     HttpStatus.CONFLICT,
    //   );
    // }
    return await this.prisma.certificate.create({ data });
  }

  async findAll(query: FindCertificateQueryDto) {
    let filter: Prisma.CertificateWhereInput[] = [];
    let search: Prisma.CertificateWhereInput[] = [];
    if (query.type?.length) {
      filter.push({
        type: {
          in: query.type,
        },
      });
    }
    if (query.status?.length) {
      filter.push({
        ownership_status: {
          in: query.status,
        },
      });
    }

    if (query.search) {
      // TODO: tambahkan yang bisa disearch apa saja
      search = [
        {
          no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          ajb_no: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    return await this.prisma.extended.certificate.paginate({
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
    return this.prisma.certificate.findFirst({
      where: { id, deleted_at: null },
    });
  }

  async update(id: number, data: UpdateCertificateBodyDto) {
    // if (
    //   await this.prisma.certificate.findFirst({
    //     where: { name: data.name, id: { not: id }, deleted_at: null },
    //   })
    // ) {
    //   throw new HttpException(
    //     'Certificate name already exists',
    //     HttpStatus.CONFLICT,
    //   );
    // }
    return await this.prisma.certificate.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.certificate.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
