import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { success } from 'src/http';
import { FindMediaQueryDto } from './dto/find-media.dto';
import { CreateMediaBodyDto } from './dto/create-media.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files[]'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateMediaBodyDto,
  ) {
    return this.mediaService.create(body, files);
  }

  @Get()
  async findAll(@Query() query: FindMediaQueryDto) {
    return success(await this.mediaService.findAll(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
