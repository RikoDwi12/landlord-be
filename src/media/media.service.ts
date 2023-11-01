import { Injectable } from '@nestjs/common';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { Media, Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma';
import { StorageService } from 'src/storage/storage.service';
import { AmazonWebServicesS3Storage } from '@kodepandai/flydrive-s3';
import { CreateMediaBodyDto, DeleteMediaBodyDto } from './dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) { }

  async attachMedia(
    trx: Prisma.TransactionClient,
    user: User,
    fileNames: string[],
    body: CreateMediaBodyDto,
  ) {
    const prisma = trx ?? this.prisma;
    // make sure the mediable is exists
    await (prisma[body.mediable_type] as any).findFirstOrThrow({
      where: {
        id: body.mediable_id,
      },
    });
    const files = await Promise.all(
      fileNames.map((fileName) => this.storage.getTmpFile(user, fileName)),
    );

    // upload media to main storage
    const uploaded: Prisma.MediaCreateInput[] = [];
    const directory = `${body.mediable_type}/${body.mediable_id}`;
    await Promise.all(
      files.map(async (file) => {
        const location = `${directory}/${file.originalname}`;
        await this.storage
          .disk<AmazonWebServicesS3Storage>()
          .put(location, file.buffer, { ContentType: file.mime });
        uploaded.push({
          size: file.size,
          filename: file.originalname,
          directory,
          extension: file.ext,
          mime_type: file.mime,
          tags: body.tags,
        });
      }),
    );

    // save to db
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

    // return uploded media with signedUrl
    return await trx.media
      .findMany({
        where: {
          filename: {
            in: uploaded.map((u) => u.filename),
          },
        },
      })
      .then(this.loadMediaUrl.bind(this));
  }

  async findAll(query: FindMediaQueryDto, trx?: Prisma.TransactionClient) {
    const prisma = trx ?? this.prisma;
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
    if (query.tags.length) {
      filter.push({
        tags: {
          hasSome: query.tags,
        },
      });
    }
    return await prisma.media
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
      .then(this.loadMediaUrl.bind(this));
  }
  async deleteMedia(
    trx: Prisma.TransactionClient,
    media: Media[],
    body: DeleteMediaBodyDto,
  ) {
    // delete pivot record
    await trx[body.mediable_type + 'Media'].deleteMany({
      where: {
        media_id: {
          in: media.map((m) => m.id),
        },
      },
    });
    // delete media
    await trx.media.deleteMany({
      where: {
        id: {
          in: media.map((m) => m.id),
        },
      },
    });
    // delete files
    await Promise.all(
      media.map((m) =>
        this.storage.disk().delete(`${m.directory}/${m.filename}`),
      ),
    );
  }

  // remove temporary files
  cleanTmp(user: User, fileNames: string[]) {
    return Promise.all(
      fileNames.map((fileName) => this.storage.removeTmpFile(user, fileName)),
    );
  }

  private async loadMediaUrl(media: Media[]) {
    return await Promise.all(
      media.map(async (media) => ({
        ...media,
        url: (
          await this.storage
            .disk()
            .getSignedUrl(`${media.directory}/${media.filename}`)
        ).signedUrl,
      })),
    );
  }
}
