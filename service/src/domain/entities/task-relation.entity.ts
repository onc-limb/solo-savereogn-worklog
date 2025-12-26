import { TaskRelationId } from "../value-objects/task-relation-id.vo";
import { TaskId } from "../value-objects/task-id.vo";
import { TaskRelationType } from "../value-objects/task-relation-type.vo";

/**
 * タスク関連Entity - タスク関連集約のルート
 * タスク間の関係を表現する
 */
export class TaskRelationEntity {
  private constructor(
    private readonly id: TaskRelationId,
    private readonly fromTaskId: TaskId,
    private readonly toTaskId: TaskId,
    private type: TaskRelationType
  ) {}

  /**
   * 新規でタスク関連Entityを作成するメソッド
   */
  static create(params: {
    fromTaskId: string;
    toTaskId: string;
    type: "depends_on" | "related";
  }): TaskRelationEntity {
    return new TaskRelationEntity(
      TaskRelationId.create(),
      TaskId.create(params.fromTaskId),
      TaskId.create(params.toTaskId),
      TaskRelationType.create(params.type)
    );
  }

  /**
   * 更新のために既存のデータを取得してタスク関連Entityを作成するメソッド
   */
  static reconstruct(params: {
    id: string;
    fromTaskId: string;
    toTaskId: string;
    type: string;
  }): TaskRelationEntity {
    return new TaskRelationEntity(
      TaskRelationId.create(params.id),
      TaskId.create(params.fromTaskId),
      TaskId.create(params.toTaskId),
      TaskRelationType.create(
        params.type as Parameters<typeof TaskRelationType.create>[0]
      )
    );
  }

  /**
   * 関係タイプを更新するメソッド
   */
  updateType(newType: TaskRelationType): void {
    this.type = newType;
  }

  // Getters
  getId(): string {
    return this.id.getValue();
  }

  getFromTaskId(): string {
    return this.fromTaskId.getValue();
  }

  getToTaskId(): string {
    return this.toTaskId.getValue();
  }

  getType(): string {
    return this.type.getValue();
  }

  isDependsOn(): boolean {
    return this.type.isDependsOn();
  }

  isRelated(): boolean {
    return this.type.isRelated();
  }

  /**
   * エンティティをプレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    fromTaskId: string;
    toTaskId: string;
    type: string;
  } {
    return {
      id: this.getId(),
      fromTaskId: this.getFromTaskId(),
      toTaskId: this.getToTaskId(),
      type: this.getType(),
    };
  }
}
