import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, JwtGuard } from 'src/auth';
import { success } from 'src/http';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  async profile(@CurrentUser('id') id: number) {
    return success(await this.userService.show(id));
  }
}
