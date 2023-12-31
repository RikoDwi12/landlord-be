import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  exports: [RoleService],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {

}
