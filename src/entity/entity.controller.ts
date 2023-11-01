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
import { EntityService } from './entity.service';
import {
  FindEntityQueryDto,
  CreateEntityBodyDto,
  UpdateEntityBodyDto,
} from './dto';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtGuard } from 'src/auth';
import { User } from '@prisma/client';

@Controller('entity')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class EntityController {
  constructor(private readonly entityService: EntityService) { }

  @Post()
  async create(@Body() body: CreateEntityBodyDto, @CurrentUser() user: User) {
    return success(await this.entityService.create(body, user));
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
  async update(
    @Param('id') id: string,
    @Body() body: UpdateEntityBodyDto,
    @CurrentUser() user: User,
  ) {
    return success(await this.entityService.update(+id, body, user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.entityService.remove(+id));
  }
}
