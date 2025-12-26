import { TaskEntity } from "../entities/task.entity";

/**
 * タスク集約のリポジトリインターフェース
 */
export interface ITaskRepository {
  /**
   * IDでタスクを取得する
   */
  findById(id: string): Promise<TaskEntity | null>;

  /**
   * すべてのタスクを取得する
   */
  findAll(): Promise<TaskEntity[]>;

  /**
   * ステータスでタスクを検索する
   */
  findByStatus(status: string): Promise<TaskEntity[]>;

  /**
   * 完了/未完了でタスクを検索する
   */
  findByIsComplete(isComplete: boolean): Promise<TaskEntity[]>;

  /**
   * タスクを保存する（新規作成・更新）
   */
  save(task: TaskEntity): Promise<void>;

  /**
   * タスクを削除する
   */
  delete(id: string): Promise<void>;
}
