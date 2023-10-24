import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, JwtGuard } from '../auth';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  async profile(@CurrentUser('id') id: number) {
    return success(await this.userService.show(id));
  }
}
