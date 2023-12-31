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
import { NopService } from './nop.service';
import { FindNopQueryDto, CreateNopBodyDto, UpdateNopBodyDto } from './dto';
import { success } from '../http';
import { JwtGuard } from 'src/auth';
import { AuthorizationGuard, NopPolicy, UsePolicy } from 'src/authorization';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(NopPolicy)
@ApiBearerAuth()
@Controller('nop')
export class NopController {
  constructor(private readonly nopService: NopService) {}

  @Post()
  async create(@Body() body: CreateNopBodyDto) {
    return success(await this.nopService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindNopQueryDto) {
    return success(await this.nopService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.nopService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateNopBodyDto) {
    return success(await this.nopService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.nopService.remove(+id));
  }

  @Get('option/taxpayer')
  async taxpayerOption() {
    return success(await this.nopService.taxpayerOption());
  }

  @Get('option/subdistrict')
  async subdistrictOption() {
    return success(await this.nopService.subdistrictOption());
  }

  @Get('option/city')
  async cityOption() {
    return success(await this.nopService.cityOption());
  }

  @Get('option/has-certificate')
  async hasCertificateOption() {
    return success(this.nopService.hasCertificateOption());
  }
}
