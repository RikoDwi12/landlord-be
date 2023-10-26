import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import {
  FindPropertyQueryDto,
  CreatePropertyBodyDto,
  UpdatePropertyBodyDto,
} from './dto';
import { success } from '../http';
import { CreateMediaBodyDto, FindMediaQueryDto } from 'src/media';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() body: CreatePropertyBodyDto) {
    return success(await this.propertyService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindPropertyQueryDto) {
    return success(await this.propertyService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.propertyService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePropertyBodyDto) {
    return success(await this.propertyService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.propertyService.remove(+id));
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: string, @Query() query: FindMediaQueryDto) {
    return success(await this.propertyService.getMediaById(+id, query));
  }

  @Post(':id/media')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files[]'))
  async attachMedia(
    @Param('id') id: string,
    @Body() _: CreateMediaBodyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return success(await this.propertyService.attachMediaForId(+id, files));
  }

  @Delete('media/:id')
  async deleteMedia(@Param('id') mediaId: number) {
    return success(await this.propertyService.deleteMedia(+mediaId));
  }
}
