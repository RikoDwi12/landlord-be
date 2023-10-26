import { Injectable } from '@nestjs/common';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { StorageService } from 'src/storage/storage.service';
import { AmazonWebServicesS3Storage } from '@kodepandai/flydrive-s3';

type Model = 'entity' | 'pbb' | 'certificate'; // TODO:tambahkan model yang punya media
@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) { }

  async attachMedia(
    files: Express.Multer.File[],
    model: Model,
    modelId: number,
  ) {
    // make sure the model is exists
    const modelInstance = await (this.prisma[model] as any).findFirstOrThrow({
      where: {
        id: modelId,
      },
    });
    // upload media ke storage
    const uploaded: Prisma.MediaCreateInput[] = [];
    const directory = `${model}/${modelInstance.id}`;
    await Promise.all(
      files.map(async (file) => {
        const location = `${directory}/${file.originalname}`;
        await this.storage
          .disk<AmazonWebServicesS3Storage>()
          .put(location, file.buffer, { ContentType: file.mimetype });
        uploaded.push({
          size: file.size,
          filename: file.originalname,
          directory,
          extension: ('.' + file.originalname.split('.').pop()) as string,
          mime_type: file.mimetype,
        });
      }),
    );

    // insert uploaded media ke tabel Media
    await this.prisma.$transaction(async (trx) => {
      await trx.media.createMany({
        data: uploaded,
      });
      const relatedMedia = await trx.media.findMany({
        where: {
          directory,
        },
      });
      await trx[model + 'Media'].createMany({
        data: relatedMedia.map((media) => ({
          media_id: media.id,
          [model + '_id']: modelId,
        })),
        skipDuplicates: true,
      });
    });
  }

  async findAll(query: FindMediaQueryDto, model: Model, modelId?: number) {
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
    if (modelId) {
      filter.push({
        entityMedia: {
          some: {
            [model + '_id']: modelId,
          },
        },
      });
    }
    return await this.prisma.extended.media
      .paginate({
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
      })
      .then(async (res) => {
        res.result = await Promise.all(
          res.result.map(async (media) => ({
            ...media,
            url: (
              await this.storage
                .disk()
                .getSignedUrl(`${media.directory}/${media.filename}`)
            ).signedUrl,
          })),
        );
        return res;
      });
  }
  deleteMedia(mediaId: number, model: Model) {
    return this.prisma.$transaction(async (trx) => {
      const media = await trx.media.findFirstOrThrow({
        where: {
          id: mediaId,
          [model + 'Media']: {
            some: {
              media_id: mediaId,
            },
          },
        },
      });
      await trx[model + 'Media'].deleteMany({
        where: {
          media_id: mediaId,
        },
      });
      await trx.media.delete({
        where: {
          id: mediaId,
        },
      });
      await this.storage.disk().delete(`${media.directory}/${media.filename}`);
    });
  }
}
