/**
 * FreeText: 0文字以上1000000文字以下の文字列
 */
export class FreeText {
  private static readonly MIN_LENGTH = 0;
  private static readonly MAX_LENGTH = 1000000;

  private constructor(private readonly value: string) {}

  static create(value: string): FreeText {
    this.validate(value);
    return new FreeText(value);
  }

  static empty(): FreeText {
    return new FreeText("");
  }

  private static validate(value: string): void {
    if (value.length < this.MIN_LENGTH) {
      throw new Error(
        `FreeText must be at least ${this.MIN_LENGTH} character(s)`
      );
    }
    if (value.length > this.MAX_LENGTH) {
      throw new Error(`FreeText must be at most ${this.MAX_LENGTH} characters`);
    }
  }

  getValue(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  equals(other: FreeText): boolean {
    return this.value === other.value;
  }
}
