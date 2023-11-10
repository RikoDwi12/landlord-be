import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseFilter } from 'src/vendor/exception';
import { AppConfigService } from './config';
import { ZodError } from 'zod';

@Catch()
export class AppFilter extends BaseFilter {
  constructor(private readonly config: AppConfigService) {
    super();
  }
  // tambahkan type exception yang tidak ingin direport (print ke console)
  protected dontReport = [HttpException];
  register(): void {
    this.renderable(ZodError, (e) => {
      return {
        response: {
          message: 'Unprocessable Entity',
          errors: this.zodFlattenError(e.format()),
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
    this.renderable(Error, (e) => {
      return {
        response: {
          message: e.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          stack: this.config.root.app.debug ? e.stack : undefined,
        },
        status: HttpStatus.INTERNAL_SERVER_ERROR,
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
    if (Number.isInteger(Number(mappedError[0][0]))) {
      return mappedError.map(([_, value]) => value);
    }
    return Object.fromEntries(mappedError);
  }
}
