import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<any>();
    return next.handle().pipe(
      map((data) => {
        if (data !== undefined) {
          return { statusCode: res.code || res.statusCode, data, error: null };
        }
        return {
          statusCode: res.code || res.statusCode,
          data: null,
          error: 'No content available',
        };
      }),
    );
  }
}
