import { Arg } from './arg';

const falsyValues = ['FALSE', '0', 'NO', 'OFF'];

export class Select extends Arg<boolean> {
  static get key(): string {
    return 'select';
  }

  protected static override normalize(input: any): boolean {
    input = String(input).toUpperCase().trim();
    return !falsyValues.includes(input);
  }
}
