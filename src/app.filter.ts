import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { BaseFilter } from './vendor/exception/filter.abstract';

@Catch()
export class AppFilter extends BaseFilter {
  // tambahkan type exception yang tidak ingin direport (print ke console)
  protected dontReport = [HttpException];
  register(): void {
    this.renderable(ZodValidationException, (e) => {
      return {
        response: {
          message: 'Unprocessable Entity',
          errors: this.zodFlattenError(e.getZodError().format()),
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      };
    });
    this.renderable(HttpException, (e) => {
      return {
        response: {
          message: e.message,
          status: e.getStatus(),
        },
        status: e.getStatus(),
      };
    });
  }

  /**
   * flatten zod error agar lebih readable, terutama jika error nested
   * */
  private zodFlattenError(zodError: Record<string, any>) {
    const errors = Object.entries(zodError).filter(
      (e) => e[0] !== '_errors',
    ) as [string, Record<string, any>][];
    const mappedError = errors.map(([key, value]) => {
      if (Object.keys(value).filter((k) => k !== '_errors').length === 0) {
        return [key, value._errors];
      }
      return [key, this.zodFlattenError(value)];
    });
    return Object.fromEntries(mappedError);
  }
}
