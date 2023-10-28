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
import { EntityService } from './entity.service';
import {
  FindEntityQueryDto,
  CreateEntityBodyDto,
  UpdateEntityBodyDto,
} from './dto';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('entity')
@ApiBearerAuth()
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Post()
  async create(@Body() body: CreateEntityBodyDto) {
    return success(await this.entityService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindEntityQueryDto) {
    return success(await this.entityService.findAll(query));
  }

  @Get('category')
  category() {
    return success(this.entityService.categoryOption());
  }

  @Get('type')
  type() {
    return success(this.entityService.typeOption());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.entityService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateEntityBodyDto) {
    return success(await this.entityService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.entityService.remove(+id));
  }
}
