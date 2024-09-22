import { ErrorSource } from '../utils/standard-exceptions';

export function DtoType(type: ErrorSource) {
  return function (constructor: Function) {
    constructor['type'] = type;
  };
}
