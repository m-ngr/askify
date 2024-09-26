import { Arg } from './arg';

enum SortOrder {
  ASC = 'ASC', // 1 | true
  DESC = 'DESC', // 0 | false
}

const descValues = ['DESC', '0', 'FALSE'];

export class Sort extends Arg<SortOrder> {
  static get key(): string {
    return 'sort';
  }

  protected static override normalize(input: any): SortOrder {
    input = String(input).toUpperCase().trim();
    if (descValues.includes(input)) {
      return SortOrder.DESC;
    } else {
      return SortOrder.ASC;
    }
  }
}
