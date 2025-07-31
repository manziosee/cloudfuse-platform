import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorMessage } from '../constants/error.constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorCode =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'error' in exceptionResponse
        ? (exceptionResponse as any).error
        : ErrorCode.INTERNAL_ERROR;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
        ? (exceptionResponse as any).message
        : ErrorMessage[ErrorCode.INTERNAL_ERROR];

    response.status(status).json({
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}