import { WorkNoteId } from "../value-objects/work-note-id.vo";
import { TaskId } from "../value-objects/task-id.vo";
import { DateOnly } from "../value-objects/date-only.vo";
import { FreeText } from "../value-objects/free-text.vo";

/**
 * 作業メモEntity - 作業メモ集約のルート
 * 特定のタスクの、特定の日の作業メモを表現する
 */
export class WorkNoteEntity {
  private constructor(
    private readonly id: WorkNoteId,
    private readonly taskId: TaskId,
    private readonly date: DateOnly,
    private note: FreeText
  ) {}

  /**
   * 新規で作業メモEntityを作成するメソッド
   */
  static create(params: {
    taskId: string;
    date?: string;
    note?: string;
  }): WorkNoteEntity {
    return new WorkNoteEntity(
      WorkNoteId.create(),
      TaskId.create(params.taskId),
      params.date ? DateOnly.create(params.date) : DateOnly.now(),
      FreeText.create(params.note ?? "")
    );
  }

  /**
   * 更新のために既存のデータを取得して作業メモEntityを作成するメソッド
   */
  static reconstruct(params: {
    id: string;
    taskId: string;
    date: string;
    note: string;
  }): WorkNoteEntity {
    return new WorkNoteEntity(
      WorkNoteId.create(params.id),
      TaskId.create(params.taskId),
      DateOnly.create(params.date),
      FreeText.create(params.note)
    );
  }

  /**
   * 作業メモの更新を行うメソッド
   */
  updateNote(newNote: string): void {
    this.note = FreeText.create(newNote);
  }

  // Getters
  getId(): string {
    return this.id.getValue();
  }

  getTaskId(): string {
    return this.taskId.getValue();
  }

  getDate(): string {
    return this.date.getValue();
  }

  getNote(): string {
    return this.note.getValue();
  }

  /**
   * エンティティをプレーンオブジェクトに変換
   */
  toPlainObject(): {
    id: string;
    taskId: string;
    date: string;
    note: string;
  } {
    return {
      id: this.getId(),
      taskId: this.getTaskId(),
      date: this.getDate(),
      note: this.getNote(),
    };
  }
}
