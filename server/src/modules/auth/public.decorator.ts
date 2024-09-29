import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
Public.key = IS_PUBLIC_KEY;

export function isPublic(context: ExecutionContext): boolean {
  return new Reflector().getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
}
