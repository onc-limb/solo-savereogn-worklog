import { WorkNoteEntity } from "../entities/work-note.entity";

/**
 * 作業メモ集約のリポジトリインターフェース
 */
export interface IWorkNoteRepository {
  /**
   * IDで作業メモを取得する
   */
  findById(id: string): Promise<WorkNoteEntity | null>;

  /**
   * すべての作業メモを取得する
   */
  findAll(): Promise<WorkNoteEntity[]>;

  /**
   * タスクIDで作業メモを検索する
   */
  findByTaskId(taskId: string): Promise<WorkNoteEntity[]>;

  /**
   * 日付で作業メモを検索する
   */
  findByDate(date: string): Promise<WorkNoteEntity[]>;

  /**
   * タスクIDと日付で作業メモを検索する
   */
  findByTaskIdAndDate(
    taskId: string,
    date: string
  ): Promise<WorkNoteEntity | null>;

  /**
   * 作業メモを保存する（新規作成・更新）
   */
  save(workNote: WorkNoteEntity): Promise<void>;

  /**
   * 作業メモを削除する
   */
  delete(id: string): Promise<void>;
}
