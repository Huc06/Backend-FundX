import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    interface ErrorMessage {
      message?: string | string[];
      [key: string]: unknown;
    }

    const messageObj =
      typeof message === 'object' ? (message as ErrorMessage) : null;
    const errorMessage =
      typeof message === 'string'
        ? message
        : messageObj && Array.isArray(messageObj.message)
          ? messageObj.message.join(', ')
          : (messageObj?.message as string) || 'An error occurred';

    const errorResponse = {
      is_success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: errorMessage,
      ...(messageObj && Array.isArray(messageObj.message)
        ? { details: messageObj.message }
        : {}),
    };

    response.status(status).json(errorResponse);
  }
}
