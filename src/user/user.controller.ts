import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, JwtGuard } from '../auth';
import { success } from '../http';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('profile')
  async profile(@CurrentUser('id') id: number) {
    return success(await this.userService.show(id));
  }
}
