import { TaskId } from "../value-objects/task-id.vo";
import { Name } from "../value-objects/name.vo";
import { DateOnly } from "../value-objects/date-only.vo";
import { FreeText } from "../value-objects/free-text.vo";
import { TaskStatus } from "../value-objects/task-status.vo";

/**
 * タスクEntity - タスク集約のルート
 * 一つのタスクを表現する
 */
export class TaskEntity {
  private constructor(
    private readonly id: TaskId,
    private name: Name,
    private readonly createdAt: DateOnly,
    private updatedAt: DateOnly,
    private isComplete: boolean,
    private status: TaskStatus,
    private description: FreeText,
    private summary: FreeText
  ) {}

  /**
   * 新規でタスクEntityを作成するメソッド
   */
  static create(params: { name: string; description?: string }): TaskEntity {
    const now = DateOnly.now();
    return new TaskEntity(
      TaskId.create(),
      Name.create(params.name),
      now,
      now,
      false,
      TaskStatus.backlog(),
      FreeText.create(params.description ?? ""),
      FreeText.empty()
    );
  }

  /**
   * 更新のために既存のデータを取得してタスクEntityを作成するメソッド
   */
  static reconstruct(params: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isComplete: boolean;
    status: string;
    description: string;
    summary: string;
  }): TaskEntity {
    return new TaskEntity(
      TaskId.create(params.id),
      Name.create(params.name),
      DateOnly.create(params.createdAt),
      DateOnly.create(params.updatedAt),
      params.isComplete,
      TaskStatus.create(
        params.status as Parameters<typeof TaskStatus.create>[0]
      ),
      FreeText.create(params.description),
      FreeText.create(params.summary)
    );
  }

  /**
   * タスクの更新を行うメソッド
   * タスクの更新ルールとして、Doneステータスに更新するときは、isCompleteをtrueにする
   */
  updateStatus(newStatus: TaskStatus): void {
    this.status = newStatus;
    this.updatedAt = DateOnly.now();

    if (newStatus.isDone()) {
      this.isComplete = true;
    }
  }

  /**
   * タスクを完了にするメソッド
   * タスクを完了にするとき、タスクのステータスはDoneにする
   */
  complete(): void {
    this.isComplete = true;
    this.status = TaskStatus.done();
    this.updatedAt = DateOnly.now();
  }

  /**
   * タスクの名前を更新するメソッド
   */
  updateName(newName: string): void {
    this.name = Name.create(newName);
    this.updatedAt = DateOnly.now();
  }

  /**
   * タスクの説明を更新するメソッド
   */
  updateDescription(newDescription: string): void {
    this.description = FreeText.create(newDescription);
    this.updatedAt = DateOnly.now();
  }

  /**
   * タスクに紐づく作業メモを要約するメソッド
   * タスクがDoneになった時に実行する
   */
  createSummary(summaryText: string): void {
    if (!this.status.isDone()) {
      throw new Error("Summary can only be created when task is done");
    }
    this.summary = FreeText.create(summaryText);
    this.updatedAt = DateOnly.now();
  }

  // Getters
  getId(): string {
    return this.id.getValue();
  }

  getName(): string {
    return this.name.getValue();
  }

  getCreatedAt(): string {
    return this.createdAt.getValue();
  }

  getUpdatedAt(): string {
    return this.updatedAt.getValue();
  }

  getIsComplete(): boolean {
    return this.isComplete;
  }

  getStatus(): string {
    return this.status.getValue();
  }

  getDescription(): string {
    return this.description.getValue();
  }

  getSummary(): string {
    return this.summary.getValue();
  }

  /**
   * エンティティをプレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isComplete: boolean;
    status: string;
    description: string;
    summary: string;
  } {
    return {
      id: this.getId(),
      name: this.getName(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      isComplete: this.getIsComplete(),
      status: this.getStatus(),
      description: this.getDescription(),
      summary: this.getSummary(),
    };
  }
}
