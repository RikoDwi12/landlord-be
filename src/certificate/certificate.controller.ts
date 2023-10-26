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
import { CertificateService } from './certificate.service';
import {
  FindCertificateQueryDto,
  CreateCertificateBodyDto,
  UpdateCertificateBodyDto,
} from './dto';
import { success } from '../http';
import { CreateMediaBodyDto, FindMediaQueryDto } from 'src/media';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  async create(@Body() body: CreateCertificateBodyDto) {
    return success(await this.certificateService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindCertificateQueryDto) {
    return success(await this.certificateService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.certificateService.findOne(+id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCertificateBodyDto,
  ) {
    return success(await this.certificateService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.certificateService.remove(+id));
  }

  @Get(':id/media')
  async getMedia(@Param('id') id: string, @Query() query: FindMediaQueryDto) {
    return success(await this.certificateService.getMediaById(+id, query));
  }

  @Post(':id/media')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files[]'))
  async attachMedia(
    @Param('id') id: string,
    @Body() _: CreateMediaBodyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return success(await this.certificateService.attachMediaForId(+id, files));
  }

  @Delete('media/:id')
  async deleteMedia(@Param('id') mediaId: number) {
    return success(await this.certificateService.deleteMedia(+mediaId));
  }
}
