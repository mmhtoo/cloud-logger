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

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly param: {
      responseType: 'data' | 'info';
      status: number;
      message: string;
    } = {
      responseType: 'info',
      status: HttpStatus.OK,
      message: 'Success!',
    },
  ) {}

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
