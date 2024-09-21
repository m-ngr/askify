import { BodyException } from './standard-exceptions';

export function throwIfDuplicate(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): void {
  if (!obj1 || !obj2) return;
  const errors: Record<string, string> = {};
  let willThrow = false;
  for (const key in obj1) {
    if (obj2.hasOwnProperty(key) && obj1[key] === obj2[key]) {
      errors[key] = `${key} must be unique`;
      willThrow = true;
    }
  }

  if (willThrow) throw new BodyException(errors, 409);
}
