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
import { JwtGuard } from 'src/auth';

@UseGuards(JwtGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @Post()
  create(@Body() body: CreateGroupBodyDto) {
    return this.groupService.create(body);
  }

  @Get()
  findAll(@Query() query: FindGroupQueryDto) {
    return this.groupService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupBodyDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
