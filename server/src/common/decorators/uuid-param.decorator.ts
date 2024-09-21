import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ParamException } from '../utils/standard-exceptions';

export const UUIDParam = createParamDecorator(
  (param: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[param];

    if (!isUUID(value)) {
      throw new ParamException(
        { [param]: `${param} must be a valid UUID` },
        400,
      );
    }

    return value;
  },
);
