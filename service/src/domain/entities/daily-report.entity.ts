import { DailyReportId } from "../value-objects/daily-report-id.vo";
import { DateOnly } from "../value-objects/date-only.vo";
import { FreeText } from "../value-objects/free-text.vo";

/**
 * 日報Entity - 日報集約のルート
 * 特定の日の作業メモを要約して日報とする
 */
export class DailyReportEntity {
  private constructor(
    private readonly id: DailyReportId,
    private readonly date: DateOnly,
    private summary: FreeText,
    private readonly createdAt: DateOnly
  ) {}

  /**
   * 新規で日報Entityを作成するメソッド
   */
  static create(params: { date: string; summary: string }): DailyReportEntity {
    const now = DateOnly.now();
    return new DailyReportEntity(
      DailyReportId.create(),
      DateOnly.create(params.date),
      FreeText.create(params.summary),
      now
    );
  }

  /**
   * 更新のために既存のデータを取得して日報Entityを作成するメソッド
   */
  static reconstruct(params: {
    id: string;
    date: string;
    summary: string;
    createdAt: string;
  }): DailyReportEntity {
    return new DailyReportEntity(
      DailyReportId.create(params.id),
      DateOnly.create(params.date),
      FreeText.create(params.summary),
      DateOnly.create(params.createdAt)
    );
  }

  /**
   * 日報の要約を更新するメソッド
   */
  updateSummary(newSummary: string): void {
    this.summary = FreeText.create(newSummary);
  }

  // Getters
  getId(): string {
    return this.id.getValue();
  }

  getDate(): string {
    return this.date.getValue();
  }

  getSummary(): string {
    return this.summary.getValue();
  }

  getCreatedAt(): string {
    return this.createdAt.getValue();
  }

  /**
   * エンティティをプレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    date: string;
    summary: string;
    createdAt: string;
  } {
    return {
      id: this.getId(),
      date: this.getDate(),
      summary: this.getSummary(),
      createdAt: this.getCreatedAt(),
    };
  }
}
