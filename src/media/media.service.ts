import { Injectable } from '@nestjs/common';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateMediaBodyDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) { }
  create(body: CreateMediaBodyDto, files: Express.Multer.File[]) {
    console.log({ body, files });
    return {};
  }

  async findAll(query: FindMediaQueryDto) {
    let filter: Prisma.MediaWhereInput[] = [];
    let search: Prisma.MediaWhereInput[] = [];

    if (query.search) {
      search = [
        {
          filename: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (query.type) {
      filter.push({
        mediable: {
          some: {
            mediable_type: query.type,
          },
        },
      });
    }
    return await this.prisma.extended.media.paginate({
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
    return `This action returns a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
