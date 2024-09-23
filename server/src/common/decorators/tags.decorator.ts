import {
  getMetadataStorage,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export const Filterable = createTag('filterable');

export function createTag(tagName: string) {
  function decorator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: tagName,
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate() {
            return true;
          },
        },
      });
    };
  }

  decorator.getProperties = function (dtoType: Function) {
    return getMetadataStorage()
      .getTargetValidationMetadatas(dtoType, '', false, false)
      .filter((m) => m.name === tagName)
      .map((m) => m.propertyName);
  };

  decorator.tagName = tagName;

  Object.defineProperty(decorator, 'tagName', {
    value: tagName,
    writable: false,
  });

  return decorator;
}
