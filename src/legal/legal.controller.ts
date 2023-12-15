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
import { LegalService } from './legal.service';
import {
  CreateLegalBodyDto,
  FindLegalQueryDto,
  updateLegalBodyDto,
} from './dto';
import { CurrentUser, JwtGuard } from 'src/auth';
import type { User } from '@prisma/client';
import { success } from 'src/http';
import { AuthorizationGuard, LegalPolicy, UsePolicy } from 'src/authorization';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(LegalPolicy)
@ApiBearerAuth()
@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Post()
  async create(@Body() body: CreateLegalBodyDto, @CurrentUser() user: User) {
    return success(await this.legalService.create(body, user));
  }

  @Get()
  async findAll(@Query() query: FindLegalQueryDto) {
    return success(await this.legalService.findAll(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.legalService.findOne(+id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: updateLegalBodyDto,
    @CurrentUser() user: User,
  ) {
    return success(await this.legalService.update(+id, body, user));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.legalService.remove(+id));
  }
}
