import { FindOptionsWhere, ILike } from 'typeorm';
import { Filterable } from '../decorators/tags.decorator';

export function createQueryFilter<T>(query: object) {
  const where: FindOptionsWhere<T> = {};
  const filters = Filterable.getProperties(query.constructor);

  for (const key of filters) {
    let value = query[key];
    if (value == undefined) continue;

    if (typeof value === 'string') {
      value = toILikePattern(value);
      if (value) where[key] = ILike(value);
    } else {
      where[key] = value;
    }
  }

  return where;
}

/**
 * Converts a custom wildcard pattern into a string suitable for ILike usage.
 * @param input - The input string with custom wildcards.
 * @param multiWildcard - Custom multi-character wildcard (default: `*`).
 * @param singleWildcard - Custom single-character wildcard (default: `?`).
 * @returns A string ready to use with ILike function in TypeORM.
 */
function toILikePattern(
  input: string,
  multiWildcard: string = '*',
  singleWildcard: string = '?',
): string {
  return input
    .trim()
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/%/g, '\\%') // Escape existing % symbols
    .replace(/_/g, '\\_') // Escape existing _ symbols
    .replace(new RegExp(`\\${multiWildcard}`, 'g'), '%') // Replace custom multi-character wildcard
    .replace(new RegExp(`\\${singleWildcard}`, 'g'), '_'); // Replace custom single-character wildcard
}
