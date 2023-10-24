import { PaginationResult } from 'prisma-paginate';
import { FindMediaQueryDto } from 'src/media/dto/find-media.dto';

export interface HasMedia<Model> {
  getMediaById(
    id: number,
    query: FindMediaQueryDto,
  ): Promise<PaginationResult<Model>>;
  attachMediaForId(id: number, files: Express.Multer.File[]): Promise<any>;
}
