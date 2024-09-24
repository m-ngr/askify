import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export class DateRange {
  from?: Date;
  to?: Date;
  days?: number;

  get dateFromDays(): Date | undefined {
    if (!this.days) return undefined;
    const date = new Date();
    date.setDate(date.getDate() - this.days);
    return date;
  }
}

export function IsDateRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const { from, to, days } = value;

          if (!isValidDate(from)) return false;
          if (!isValidDate(to)) return false;
          if (!isPositiveNumber(days)) return false;

          return true;
        },

        defaultMessage(args: ValidationArguments) {
          const { from, to, days } = args.value;

          if (!isValidDate(from)) {
            return "The 'from' field must be a valid date.";
          }
          if (!isValidDate(to)) {
            return "The 'to' field must be a valid date.";
          }
          if (!isPositiveNumber(days)) {
            return "The 'days' field must be a positive number.";
          }
          return 'Invalid date range. Please provide valid dates and a positive number for days.';
        },
      },
    });
  };
}

export function DateRangeTransform() {
  return Transform(({ value }) => {
    const { from, to, days } = value;
    const dateRange = new DateRange();
    if (from) dateRange.from = new Date(from);
    if (to) dateRange.to = new Date(to);
    if (days) dateRange.days = parseInt(days);
    return dateRange;
  });
}

function isValidDate(input: any): boolean {
  if (!input) return true; //optional
  if (!(input instanceof Date)) return false;
  return !isNaN(input.getTime());
}

function isPositiveNumber(input: any): boolean {
  if (input == undefined) return true; //optional
  if (typeof input !== 'number') return false;
  if (isNaN(input)) return false;
  if (input <= 0) return false;
  return true;
}
