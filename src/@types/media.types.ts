import { Media } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate';
import { FindMediaQueryDto } from 'src/media/dto/find-media.dto';

export interface HasMedia {
  getMediaById(
    id: number,
    query: FindMediaQueryDto,
  ): Promise<PaginationResult<Media[]>>;
  attachMediaForId(id: number, files: Express.Multer.File[]): Promise<void>;
  deleteMedia(mediaId: number): Promise<void>;
}
