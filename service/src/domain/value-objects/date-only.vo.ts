/**
 * DateOnly: YYYY-MM-DDで日付までを持つ型。JSTで計算する
 */
export class DateOnly {
  private static readonly DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  private static readonly JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

  private constructor(private readonly value: string) {}

  static create(value: string): DateOnly {
    this.validate(value);
    return new DateOnly(value);
  }

  /**
   * 現在日時からJSTベースでDateOnlyを作成する
   */
  static now(): DateOnly {
    const now = new Date();
    const jstDate = new Date(now.getTime() + this.JST_OFFSET);
    const dateString = jstDate.toISOString().split("T")[0];
    return new DateOnly(dateString);
  }

  /**
   * Dateオブジェクトから作成する（JSTとして解釈）
   */
  static fromDate(date: Date): DateOnly {
    const jstDate = new Date(date.getTime() + this.JST_OFFSET);
    const dateString = jstDate.toISOString().split("T")[0];
    return new DateOnly(dateString);
  }

  private static validate(value: string): void {
    if (!this.DATE_PATTERN.test(value)) {
      throw new Error("DateOnly must be in YYYY-MM-DD format");
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("DateOnly must be a valid date");
    }
  }

  getValue(): string {
    return this.value;
  }

  toDate(): Date {
    return new Date(this.value);
  }

  equals(other: DateOnly): boolean {
    return this.value === other.value;
  }

  isBefore(other: DateOnly): boolean {
    return this.value < other.value;
  }

  isAfter(other: DateOnly): boolean {
    return this.value > other.value;
  }
}
