import { DailyReportEntity } from "../entities/daily-report.entity";

/**
 * 日報集約のリポジトリインターフェース
 */
export interface IDailyReportRepository {
  /**
   * IDで日報を取得する
   */
  findById(id: string): Promise<DailyReportEntity | null>;

  /**
   * すべての日報を取得する
   */
  findAll(): Promise<DailyReportEntity[]>;

  /**
   * 日付で日報を検索する
   */
  findByDate(date: string): Promise<DailyReportEntity | null>;

  /**
   * 日報を保存する（新規作成・更新）
   */
  save(dailyReport: DailyReportEntity): Promise<void>;

  /**
   * 日報を削除する
   */
  delete(id: string): Promise<void>;
}
