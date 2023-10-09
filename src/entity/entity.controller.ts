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

@Controller('entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) { }

  @Post()
  create(@Body() body: CreateEntityBodyDto) {
    return this.entityService.create(body);
  }

  @Get()
  findAll(@Query() query: FindEntityQueryDto) {
    return this.entityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateEntityBodyDto) {
    return this.entityService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entityService.remove(+id);
  }
}
