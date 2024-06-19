import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

type Response<T> = {
  status: number;
  timestamp: string;
  message: string;
  data?: T;
};

type ResponseMetaData = {
  responseType?: 'data' | 'info';
  status?: number;
  message?: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly param?: ResponseMetaData) {
    const defaultParam: ResponseMetaData = {
      responseType: 'info',
      status: HttpStatus.OK,
      message: 'Success!',
    };
    this.param = param ? { ...defaultParam, ...param } : defaultParam;
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const base = {
          status: this.param.status,
          timestamp: new Date().toISOString(),
          message: this.param.message,
        };
        if (this.param.responseType === 'info') {
          return base;
        }
        return { ...base, data };
      }),
    );
  }
}
