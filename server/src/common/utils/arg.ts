export interface ArgOf<T> {
  new (value?: Record<string, any>): T;
  from(input: any): T;
  fromArray(input: string[]): T;
  fromString(input: string): T;
  fromObject(input: object): T;
  key: string;
}

export class Arg<T> {
  static get key(): string {
    throw new Error('Not implemented. Derived class must implement.');
  }

  constructor(public readonly value: Record<string, T> = {}) {}

  static from(input: any) {
    if (Array.isArray(input)) {
      return this.fromArray(input);
    } else if (typeof input === 'string') {
      return this.fromString(input);
    } else if (typeof input === 'object') {
      return this.fromObject(input);
    } else {
      return new this();
    }
  }

  static fromObject(object: Record<string, string>) {
    const value: Record<string, any> = {};
    for (const field in object) {
      if (field.trim()) value[field.trim()] = this.normalize(object[field]);
    }
    return new this(value);
  }

  static fromString(input: string) {
    return this.fromArray(input.split(','));
  }

  static fromArray(array: string[]) {
    const obj: Record<string, any> = array.reduce((map, entry) => {
      const [key, value] = entry.split(':');
      if (key.trim()) map[key.trim()] = this.normalize(value);
      return map;
    }, {});
    return new this(obj);
  }

  protected static normalize(input: any): any {
    return input;
  }
}
