import { Transform } from 'class-transformer';

export type BooleanTransformOptions = {
  falsyValues?: any[];
  nativeFalsy?: boolean;
  caseInsensitive?: boolean;
};

const DEFAULT_OPTIONS: BooleanTransformOptions = {
  falsyValues: ['0', 'false', 'null', 'undefined', 'no', 'off'],
  nativeFalsy: true,
  caseInsensitive: true,
};

export function BooleanTransform(options?: BooleanTransformOptions) {
  let { falsyValues, nativeFalsy, caseInsensitive } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (caseInsensitive) {
    falsyValues = falsyValues.map((v) =>
      typeof v === 'string' ? v.toLowerCase() : v,
    );
  }

  return Transform(({ value }) => {
    if (typeof value === 'boolean') return value;

    if (nativeFalsy && !Boolean(value)) return false;

    if (caseInsensitive && typeof value === 'string') {
      value = value.toLowerCase();
    }

    if (falsyValues.includes(value)) return false;

    return true;
  });
}
