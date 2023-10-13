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
import { PropertyService } from './property.service';
import {
  FindPropertyQueryDto,
  CreatePropertyBodyDto,
  UpdatePropertyBodyDto,
} from './dto';
import { success } from 'src/http';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

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
}
