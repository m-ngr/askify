import { applyDecorators } from '@nestjs/common';
import { IsAlphanumeric, Length } from 'class-validator';
import { StringTransform } from './string-transform.decorator';

export function IsUsername() {
  return applyDecorators(
    StringTransform({ case: 'lower', trim: 'both' }),
    Length(3, 50),
    IsAlphanumeric(),
  );
}
