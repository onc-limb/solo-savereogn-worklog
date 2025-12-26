import { Id } from "./id.vo";

/**
 * DailyReportId: 日報を一意に表す識別子
 */
export class DailyReportId extends Id {
  static create(value?: string): DailyReportId {
    const id = value ? new DailyReportId(value) : new DailyReportId();
    return id;
  }
}
