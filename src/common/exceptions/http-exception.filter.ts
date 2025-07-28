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

    response.status(status).json({
      statusCode: status,
      errorCode: exceptionResponse['error'] || ErrorCode.INTERNAL_ERROR,
      message: exceptionResponse['message'] || ErrorMessage[ErrorCode.INTERNAL_ERROR],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}