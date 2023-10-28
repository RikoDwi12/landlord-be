import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import {
  FindCertificateQueryDto,
  CreateCertificateBodyDto,
  UpdateCertificateBodyDto,
} from './dto';
import { success } from '../http';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

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
}
