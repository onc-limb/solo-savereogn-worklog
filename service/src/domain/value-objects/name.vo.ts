/**
 * Name: 1文字以上で100文字以下の文字列
 */
export class Name {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private constructor(private readonly value: string) {}

  static create(value: string): Name {
    this.validate(value);
    return new Name(value);
  }

  private static validate(value: string): void {
    if (value.length < this.MIN_LENGTH) {
      throw new Error(`Name must be at least ${this.MIN_LENGTH} character(s)`);
    }
    if (value.length > this.MAX_LENGTH) {
      throw new Error(`Name must be at most ${this.MAX_LENGTH} characters`);
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Name): boolean {
    return this.value === other.value;
  }
}
