import { Injectable } from '@nestjs/common';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { StorageService } from 'src/storage/storage.service';
import { AmazonWebServicesS3Storage } from '@kodepandai/flydrive-s3';
import { CreateMediaBodyDto, DeleteMediaBodyDto } from './dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async attachMedia(files: Express.Multer.File[], body: CreateMediaBodyDto) {
    // make sure the mediable is exists
    await (this.prisma[body.mediable_type] as any).findFirstOrThrow({
      where: {
        id: body.mediable_id,
      },
    });
    // upload media ke storage
    const uploaded: Prisma.MediaCreateInput[] = [];
    const directory = `${body.mediable_type}/${body.mediable_id}`;
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
      await trx[body.mediable_type + 'Media'].createMany({
        data: relatedMedia.map((media) => ({
          media_id: media.id,
          [body.mediable_type + '_id']: body.mediable_id,
        })),
        skipDuplicates: true,
      });
    });
  }

  async findAll(query: FindMediaQueryDto) {
    let filter: Prisma.MediaWhereInput[] = [];
    let search: Prisma.MediaWhereInput[] = [];

    if (query.mediable_type && query.mediable_id) {
      filter.push({
        [query.mediable_type + 'Media']: {
          every: {
            [query.mediable_type + '_id']: query.mediable_id,
          },
        },
      });
    }
    return await this.prisma.media
      .findMany({
        where: {
          deleted_at: null,
          AND: [
            ...filter,
            {
              OR: search,
            },
          ],
        },
      })
      .then(async (res) => {
        res = await Promise.all(
          res.map(async (media) => ({
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
  deleteMedia(mediaId: number, body: DeleteMediaBodyDto) {
    return this.prisma.$transaction(async (trx) => {
      const media = await trx.media.findFirstOrThrow({
        where: {
          id: mediaId,
          [body.mediable_type + 'Media']: {
            some: {
              media_id: mediaId,
            },
          },
        },
      });
      await trx[body.mediable_type + 'Media'].deleteMany({
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
