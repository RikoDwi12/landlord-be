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
import { PbbService } from './pbb.service';
import { FindPbbQueryDto, CreatePbbBodyDto, UpdatePbbBodyDto } from './dto';
import { success } from '../http';

@Controller('pbb')
export class PbbController {
  constructor(private readonly pbbService: PbbService) { }

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
}
