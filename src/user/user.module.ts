import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
