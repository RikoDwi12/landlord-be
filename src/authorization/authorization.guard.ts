import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsePolicy } from './authorization.decorator';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    private readonly authorization: AuthorizationService,
  ) { }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const policyClass = this.reflect.get(UsePolicy, context.getClass());
    await this.authorization.forUser(req.user);
    req.ability = this.authorization.ability;
    const policy = new policyClass(this.authorization, req.user, req.params);
    const controllerMethod = context.getHandler().name;
    if(!policy[controllerMethod]) {
      throw new InternalServerErrorException(`No policy found for ${policyClass.name}.${controllerMethod}`);
    }

    return policy[controllerMethod]();
  }
}
