import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

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

    return new BadRequestException({ errors });
  };
}
