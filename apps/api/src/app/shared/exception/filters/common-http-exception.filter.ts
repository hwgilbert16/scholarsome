import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
import { CommonHttpException } from "../exceptions/common-http.exception";

@Catch(CommonHttpException)
export class CommonHttpExceptionFilter implements ExceptionFilter {
  catch(exception: CommonHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      ...exception.getInfo(),
      instance: request.url
    });
  }
}
