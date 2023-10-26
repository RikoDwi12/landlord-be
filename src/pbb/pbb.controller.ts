import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PbbService } from './pbb.service';
import { FindPbbQueryDto, CreatePbbBodyDto, UpdatePbbBodyDto } from './dto';
import { success } from '../http';
import { CreateMediaBodyDto, FindMediaQueryDto } from 'src/media';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('pbb')
export class PbbController {
  constructor(private readonly pbbService: PbbService) {}

  @Post()
  async create(@Body() body: CreatePbbBodyDto) {
    return success(await this.pbbService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindPbbQueryDto) {
    return success(await this.pbbService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.pbbService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePbbBodyDto) {
    return success(await this.pbbService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.pbbService.remove(+id));
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: string, @Query() query: FindMediaQueryDto) {
    return success(await this.pbbService.getMediaById(+id, query));
  }

  @Post(':id/media')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files[]'))
  async attachMedia(
    @Param('id') id: string,
    @Body() _: CreateMediaBodyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return success(await this.pbbService.attachMediaForId(+id, files));
  }

  @Delete('media/:id')
  async deleteMedia(@Param('id') mediaId: number) {
    return success(await this.pbbService.deleteMedia(+mediaId));
  }
}
