import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, JwtGuard } from '../auth';
import { success } from '../http';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationGuard, UsePolicy, UserPolicy } from 'src/authorization';
import type { User } from '@prisma/client';
import { RoleService } from 'src/role/role.service';

@UseGuards(JwtGuard, AuthorizationGuard)
@UsePolicy(UserPolicy)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly roleService: RoleService) {}

  @Get('profile')
  async profile(@CurrentUser() user: User) {
    return success(await this.userService.show(user.id));
  }

  @Get('ability')
  async ability(@CurrentUser() user: User){
    return success(await this.roleService.abilityFor(user))
  }
}
