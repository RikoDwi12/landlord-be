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
import { NopService } from './nop.service';
import { FindNopQueryDto, CreateNopBodyDto, UpdateNopBodyDto } from './dto';

@Controller('nop')
export class NopController {
  constructor(private readonly nopService: NopService) { }

  @Post()
  create(@Body() body: CreateNopBodyDto) {
    return this.nopService.create(body);
  }

  @Get()
  findAll(@Query() query: FindNopQueryDto) {
    return this.nopService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nopService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateNopBodyDto) {
    return this.nopService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nopService.remove(+id);
  }
}
