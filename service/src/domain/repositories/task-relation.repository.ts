import { TaskRelationEntity } from "../entities/task-relation.entity";

/**
 * タスク関連集約のリポジトリインターフェース
 */
export interface ITaskRelationRepository {
  /**
   * IDでタスク関連を取得する
   */
  findById(id: string): Promise<TaskRelationEntity | null>;

  /**
   * すべてのタスク関連を取得する
   */
  findAll(): Promise<TaskRelationEntity[]>;

  /**
   * 関係元タスクIDでタスク関連を検索する
   */
  findByFromTaskId(fromTaskId: string): Promise<TaskRelationEntity[]>;

  /**
   * 関係先タスクIDでタスク関連を検索する
   */
  findByToTaskId(toTaskId: string): Promise<TaskRelationEntity[]>;

  /**
   * 特定のタスクに関連するすべてのタスク関連を取得する（from/to両方）
   */
  findByTaskId(taskId: string): Promise<TaskRelationEntity[]>;

  /**
   * タスク関連を保存する（新規作成・更新）
   */
  save(taskRelation: TaskRelationEntity): Promise<void>;

  /**
   * タスク関連を削除する
   */
  delete(id: string): Promise<void>;
}
