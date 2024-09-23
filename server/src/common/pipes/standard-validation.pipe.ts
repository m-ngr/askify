import {
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ErrorSource, StandardException } from '../utils/standard-exceptions';

const DEFAULT_OPTIONS: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
};

@Injectable()
export class StandardValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({ ...DEFAULT_OPTIONS, ...options });
  }

  protected exceptionFactory = (validationErrors: ValidationError[] = []) => {
    const errors = validationErrors.reduce((acc, error) => {
      const type: ErrorSource = error.target.constructor['type'] ?? 'body';
      acc[type] = acc[type] ?? {};
      acc[type][error.property] = Object.values(error.constraints);
      return acc;
    }, {});

    return new StandardException(errors, 400);
  };
}
