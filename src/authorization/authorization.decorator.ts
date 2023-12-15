import { Reflector } from '@nestjs/core';
import { Policy } from './policy.abstract';
import { createParamDecorator } from '@nestjs/common';

export const Ability = createParamDecorator((_, ctx) => {
  return ctx.switchToHttp().getRequest().ability;
});
export const UsePolicy = Reflector.createDecorator<typeof Policy>();
