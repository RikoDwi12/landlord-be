import { Injectable } from '@nestjs/common';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: FindMediaQueryDto, model: 'entity', modelId?: number) {
    interface whereInputs {
      entity: Prisma.EntityMediaWhereInput;
    }
    type WhereInput = whereInputs[typeof model];

    let filter: WhereInput[] = [];
    let search: WhereInput[] = [];

    if (query.search) {
      search = [
        {
          media: {
            filename: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    if (modelId) {
      filter.push({
        [model + '_id']: modelId,
      });
    }
    return await this.prisma.extended[model + 'Media'].paginate({
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
}
