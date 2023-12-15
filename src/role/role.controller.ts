import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  CreateRoleBodyDto,
  UpdateRoleBodyDto,
  FindRoleQueryDto,
} from './dto';
import { JwtGuard } from '../auth';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationGuard, UsePolicy, RolePolicy } from 'src/authorization';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(RolePolicy)
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() body: CreateRoleBodyDto) {
    return success(await this.roleService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindRoleQueryDto) {
    return success(await this.roleService.findAll(query));
  }

  @Get('permission')
  allPermission() {
    return success(this.roleService.allPermission());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.roleService.findOne(+id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleBodyDto,
  ) {
    return success(await this.roleService.update(+id, updateRoleDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.roleService.remove(+id));
  }

}
