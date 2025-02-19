import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const statuscode = status;

    const responseBody = {
      statuscode,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] || 'An error occurred',
    };

    response.status(status).json(responseBody);
  }
}
