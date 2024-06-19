import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exception';
import { CODE } from '../constant';

export default class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    if (exception instanceof ValidationException) {
      return response.status(400).json({
        status: 400,
        timestamp: new Date().toISOString(),
        error: exception.getResponse(),
      });
    }

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      error: exception.getResponse
        ? exception.getResponse().message || CODE.UNKNOWN_ERROR
        : CODE.UNKNOWN_ERROR,
    });
  }
}
