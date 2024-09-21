import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

export type ErrorSource = 'params' | 'query' | 'body';
export class StandardException extends HttpException {
  constructor(
    errors: Partial<Record<ErrorSource, Record<string, string | string[]>>>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const normalizedErrors = Object.fromEntries(
      Object.entries(errors).map(([source, messages]) => [
        source,
        Object.fromEntries(
          Object.entries(messages).map(([property, msg]) => [
            property,
            Array.isArray(msg) ? msg : [msg],
          ]),
        ),
      ]),
    );

    super({ errors: normalizedErrors }, statusCode);
  }
}

export class BodyException extends StandardException {
  constructor(
    errors: Record<string, string | string[]>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ body: errors }, statusCode);
  }
}

export class ParamException extends StandardException {
  constructor(
    errors: Record<string, string | string[]>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ params: errors }, statusCode);
  }
}

export class QueryException extends StandardException {
  constructor(
    errors: Record<string, string | string[]>,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ query: errors }, statusCode);
  }
}
