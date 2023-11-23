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
import { CrmService } from './crm.service';
import { FindCrmQueryDto, CreateCrmBodyDto, UpdateCrmBodyDto } from './dto';
import { success } from '../http';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post()
  async create(@Body() body: CreateCrmBodyDto) {
    return success(await this.crmService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindCrmQueryDto) {
    return success(await this.crmService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.crmService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCrmBodyDto) {
    return success(await this.crmService.update(+id, body));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.crmService.remove(+id));
  }
}
