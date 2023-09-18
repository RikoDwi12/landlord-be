import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((key, ctx) => {
  const user = ctx.switchToHttp().getRequest().user;
  return key ? user[key] : user;
});
