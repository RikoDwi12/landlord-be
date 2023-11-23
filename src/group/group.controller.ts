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
import { GroupService } from './group.service';
import {
  CreateGroupBodyDto,
  UpdateGroupBodyDto,
  FindGroupQueryDto,
} from './dto';
import { JwtGuard } from '../auth';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() body: CreateGroupBodyDto) {
    return success(await this.groupService.create(body));
  }

  @Get()
  async findAll(@Query() query: FindGroupQueryDto) {
    return success(await this.groupService.findAll(query));
  }

  @Get('option')
  async option() {
    return success(await this.groupService.option());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return success(await this.groupService.findOne(+id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupBodyDto,
  ) {
    return success(await this.groupService.update(+id, updateGroupDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return success(await this.groupService.remove(+id));
  }
}
