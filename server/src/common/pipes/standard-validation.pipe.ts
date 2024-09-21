import {
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { BodyException } from '../utils/standard-exceptions';

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
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});

    return new BodyException(errors, 400);
  };
}
