import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      title: exception.name,
      detail: exception.message,
      instance: request.url
    });
  }
}
