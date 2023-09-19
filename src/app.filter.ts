import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { BaseFilter } from './vendor/exception';
import { AppConfigService } from './config';

@Catch()
export class AppFilter extends BaseFilter {
  constructor(private readonly config: AppConfigService) {
    super();
  }
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
    return Object.fromEntries(mappedError);
  }
}
