//TODO: publish ke npm
import { ArgumentsHost, Catch, HttpStatus, OnModuleInit } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';

type RenderUsing<E> = (e: E, req: Request) => { response: any; status: number };
type ReportUsing<E> = (e: E) => void;
interface RenderCallback<E> {
  exception: Class<E>;
  renderUsing: RenderUsing<E>;
}
interface ReportCallback<E> {
  exception: Class<E>;
  reportUsing: ReportUsing<E>;
}
@Catch()
export abstract class BaseFilter
  extends BaseExceptionFilter
  implements OnModuleInit
{
  protected renderCallbacks: RenderCallback<any>[] = [];
  protected reportCallbacks: ReportCallback<any>[] = [];
  protected dontReport: Class<Error>[] = [];

  register() {}
  public renderable<E = Error>(
    exception: Class<E>,
    renderUsing: RenderUsing<E>,
  ) {
    this.renderCallbacks.push({ exception, renderUsing });
  }
  public reportable<E = Error>(
    exception: Class<E>,
    reportUsing: ReportUsing<E>,
  ) {
    this.reportCallbacks.push({ exception, reportUsing });
  }
  catch(e: unknown, host: ArgumentsHost): void {
    this.render(e, host);
    this.report(e);
  }

  protected render(e: unknown, host: ArgumentsHost) {
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    if (httpAdapter) {
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let responseBody = {};
      const ctx = host.switchToHttp();
      for (let i = 0; i < this.renderCallbacks.length; i++) {
        const { exception, renderUsing } = this.renderCallbacks[i];
        if (e instanceof exception) {
          const { status, response } = renderUsing(e, ctx.getRequest());
          responseBody = response || {};
          statusCode = status;
          break;
        }
      }
      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
  }
  protected report(e: unknown) {
    if (this.shouldntReport(e)) return;
    // TODO: make logger
    let report = (e: any) => {
      console.log(e);
    };
    this.reportCallbacks.forEach(({ exception, reportUsing }) => {
      if (e instanceof exception) {
        report = reportUsing;
      }
    });
    report(e);
  }
  onModuleInit() {
    this.register();
  }
  protected shouldntReport(e: unknown) {
    return this.dontReport.findIndex((x) => e instanceof x) >= 0;
  }
}
