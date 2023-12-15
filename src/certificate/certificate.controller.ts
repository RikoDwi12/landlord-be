import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import {
  FindCertificateQueryDto,
  CreateCertificateBodyDto,
  UpdateCertificateBodyDto,
} from './dto';
import { success } from '../http';
import { CurrentUser, JwtGuard } from 'src/auth';
import type { User } from '@prisma/client';
import { AuthorizationGuard, UsePolicy, CertificatePolicy } from 'src/authorization';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(CertificatePolicy)
@ApiBearerAuth()
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  async create(
    @Body() body: CreateCertificateBodyDto,
    @CurrentUser() user: User,
  ) {
    return success(await this.certificateService.create(body, user));
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
    @CurrentUser() user: User,
  ) {
    return success(await this.certificateService.update(+id, body, user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.certificateService.remove(+id));
  }
}
