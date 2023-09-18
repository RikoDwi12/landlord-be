import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseFilter } from './exception/filter.abstract';
import { ZodValidationException } from 'nestjs-zod';

@Catch()
export class AppFilter extends BaseFilter {
  // tambahkan type exception yang tidak ingin direport (print ke console)
  protected dontReport = [HttpException];
  register(): void {
    this.renderable(ZodValidationException, (e, req) => {
      return {
        response: {
          message: 'Unprocessable Entity',
          errors: e.getZodError().format(),
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      };
    });
    this.renderable(HttpException, (e, req) => {
      return {
        response: {
          message: e.message,
          status: e.getStatus(),
        },
        status: e.getStatus(),
      };
    });
  }
}
