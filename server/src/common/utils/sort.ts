import { getEntityFields } from './common';

enum SortOrder {
  ASC = 'ASC', // 1 | true
  DESC = 'DESC', // 0 | false
}

export class Sort {
  constructor(public readonly sortOrder: Record<string, SortOrder> = {}) {}

  static fromObject(object: Record<string, string>): Sort {
    const sort: Record<string, SortOrder> = {};
    for (const field in object) {
      sort[field.trim()] = toSortOrder(object[field]);
    }
    return new Sort(sort);
  }

  static fromString(sort: string, order: string = ''): Sort {
    const sortArr = sort.split(',').map((f) => f.trim());
    const orderArr = order.split(',').map(toSortOrder);
    return Sort.fromArray(sortArr, orderArr);
  }

  static fromArray(sort: string[], order: string[]): Sort {
    const sortMap: Record<string, SortOrder> = sort.reduce(
      (map, field, index) => {
        map[field] = order[index] ?? SortOrder.ASC;
        return map;
      },
      {},
    );
    return new Sort(sortMap);
  }

  validate(entity: Function): string[] {
    const entityFields = getEntityFields(entity);
    const errors: string[] = [];
    for (const field in this.sortOrder) {
      if (entityFields.includes(field)) continue;
      errors.push(`'${field}' is not a valid sorting field.`);
    }
    return errors;
  }
}

const descValues = ['DESC', '0', 'FALSE'];

function toSortOrder(value: any): SortOrder {
  value = String(value).toUpperCase().trim();
  if (descValues.includes(value)) {
    return SortOrder.DESC;
  } else {
    return SortOrder.ASC;
  }
}
