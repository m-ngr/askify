import { Transform } from 'class-transformer';

export type StringTrimOptions = 'start' | 'end' | 'both' | 'none';
export type StringCaseOptions =
  | 'none'
  | 'lower'
  | 'upper'
  | 'capitalize'
  | 'title'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab';

export type StringFilterOptions = {
  remove?: string | string[];
  keep?: string | string[];
  digits?: boolean;
  alphabets?: boolean;
  specialChars?: boolean;
  accents?: boolean;
  whitespace?: boolean;
  nonAscii?: boolean;
};

export type StringTransformOptions = {
  preTransform?: (value: any) => any;
  defaultValue?: string;
  stringify?: boolean;
  substring?: { start: number; end?: number };
  reverse?: boolean;
  replace?: {
    searchValue: string | RegExp;
    replaceValue: string;
    firstOnly?: boolean;
  };
  filter?: StringFilterOptions;
  trim?: StringTrimOptions;
  whitespace?: { collapse?: boolean; replace?: string };
  prefix?: string;
  suffix?: string;
  case?: StringCaseOptions;
  postTransform?: (value: string) => any;
};

const DEFAULT_OPTIONS: StringTransformOptions = {
  stringify: true,
  trim: 'both',
  whitespace: { collapse: true },
};

export function StringTransform(
  options: StringTransformOptions = DEFAULT_OPTIONS,
) {
  return Transform(({ value }) => {
    if (!options) return value;

    value = options.preTransform?.(value) ?? value;

    if (value == undefined) return options.defaultValue ?? value;

    if (options.stringify) value = stringify(value);

    if (typeof value !== 'string') return value;

    let result: string = value;

    if (options.substring) {
      result = result.substring(options.substring.start, options.substring.end);
    }

    if (options.reverse) result = result.split('').reverse().join('');

    if (options.replace) result = replace(result, options.replace);

    if (options.filter) result = filter(result, options.filter);

    if (options.trim) result = trim(result, options.trim);

    if (options.whitespace) {
      result = transformSpace(
        result,
        options.whitespace.collapse,
        options.whitespace.replace,
      );
    }

    if (options.prefix) result = options.prefix + result;
    if (options.suffix) result = result + options.suffix;

    if (options.case) result = transformCase(result, options.case);

    result = options.postTransform?.(result) ?? result;

    return result;
  });
}

function trim(input: string, options?: StringTrimOptions) {
  switch (options) {
    case 'start':
      return input.trimStart();
    case 'end':
      return input.trimEnd();
    case 'both':
      return input.trim();
    default:
      return input;
  }
}

function transformCase(input: string, options?: StringCaseOptions): string {
  switch (options) {
    case 'lower':
      return input.toLowerCase();
    case 'upper':
      return input.toUpperCase();
    case 'capitalize':
      return input.toLowerCase().replace(/\b\w/, (char) => char.toUpperCase());
    case 'title':
      return input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    case 'pascal':
      return transformSpace(transformCase(input, 'title'), true, '');
    case 'camel':
      return transformCase(input, 'pascal').replace(/\b\w/, (char) =>
        char.toLowerCase(),
      );
    case 'snake':
      return transformSpace(input.toLowerCase().trim(), true, '_');
    case 'kebab':
      return transformSpace(input.toLowerCase().trim(), true, '-');
    default:
      return input;
  }
}

function transformSpace(input: string, collapse?: boolean, replace?: string) {
  if (collapse) input = input.replace(/\s+/g, ' ');
  if (typeof replace === 'string') input = input.replace(/\s/g, replace);
  return input;
}

function stringify(input: any): string {
  if (typeof input === 'object') return JSON.stringify(input);
  return String(input);
}

function replace(
  input: string,
  options: {
    searchValue: string | RegExp;
    replaceValue: string;
    firstOnly?: boolean;
  },
) {
  const { searchValue, replaceValue, firstOnly } = options;
  return firstOnly
    ? input.replace(searchValue, replaceValue)
    : input.replaceAll(searchValue, replaceValue);
}

function filter(input: string, filter: StringFilterOptions): string {
  let result = input;
  const {
    remove,
    keep,
    digits,
    alphabets,
    specialChars,
    accents,
    whitespace,
    nonAscii,
  } = filter;

  if (remove) {
    const removePattern = Array.isArray(remove) ? remove.join('') : remove;
    result = result.replace(new RegExp(`[${removePattern}]`, 'g'), '');
  }

  if (keep) {
    const keepPattern = Array.isArray(keep) ? keep.join('') : keep;
    result = result.replace(new RegExp(`[^${keepPattern}]`, 'g'), '');
  }

  // remove specific types of characters
  if (digits) result = result.replace(/\d/g, '');
  if (alphabets) result = result.replace(/[a-zA-Z]/g, '');
  if (specialChars) result = result.replace(/[^\w\s]/g, '');
  if (accents) result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (whitespace) result = result.replace(/\s/g, '');
  if (nonAscii) result = result.replace(/[^\x00-\x7F]/g, '');

  return result;
}
