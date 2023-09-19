import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, JwtGuard } from 'src/auth';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('profile')
  profile(@CurrentUser('id') id: number) {
    return this.userService.show(id);
  }
}
