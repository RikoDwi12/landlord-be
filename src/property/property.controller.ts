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
import { PropertyService } from './property.service';
import {
  FindPropertyQueryDto,
  CreatePropertyBodyDto,
  UpdatePropertyBodyDto,
} from './dto';
import { success } from '../http';
import { CurrentUser, JwtGuard } from 'src/auth';
import type { User } from '@prisma/client';
import { AuthorizationGuard, PropertyPolicy, UsePolicy } from 'src/authorization';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(PropertyPolicy)
@ApiBearerAuth()
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() body: CreatePropertyBodyDto, @CurrentUser() user: User) {
    return success(await this.propertyService.create(body, user));
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
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePropertyBodyDto,
    @CurrentUser() user: User,
  ) {
    return success(await this.propertyService.update(+id, body, user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.propertyService.remove(+id));
  }
}
