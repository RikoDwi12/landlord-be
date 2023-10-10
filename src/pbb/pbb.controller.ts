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

@Controller('pbb')
export class PbbController {
  constructor(private readonly pbbService: PbbService) { }

  @Post()
  create(@Body() body: CreatePbbBodyDto) {
    return this.pbbService.create(body);
  }

  @Get()
  findAll(@Query() query: FindPbbQueryDto) {
    return this.pbbService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pbbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePbbBodyDto) {
    return this.pbbService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pbbService.remove(+id);
  }
}
