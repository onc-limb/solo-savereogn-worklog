/**
 * TaskStatus: backlog, todo, doing, done, archiveの五つのステータスを持つ
 */
export const TaskStatusValues = {
  BACKLOG: "backlog",
  TODO: "todo",
  DOING: "doing",
  DONE: "done",
  ARCHIVE: "archive",
} as const;

export type TaskStatusValue =
  (typeof TaskStatusValues)[keyof typeof TaskStatusValues];

export class TaskStatus {
  private constructor(private readonly value: TaskStatusValue) {}

  static create(value: TaskStatusValue): TaskStatus {
    this.validate(value);
    return new TaskStatus(value);
  }

  static backlog(): TaskStatus {
    return new TaskStatus(TaskStatusValues.BACKLOG);
  }

  static todo(): TaskStatus {
    return new TaskStatus(TaskStatusValues.TODO);
  }

  static doing(): TaskStatus {
    return new TaskStatus(TaskStatusValues.DOING);
  }

  static done(): TaskStatus {
    return new TaskStatus(TaskStatusValues.DONE);
  }

  static archive(): TaskStatus {
    return new TaskStatus(TaskStatusValues.ARCHIVE);
  }

  private static validate(value: string): void {
    const validValues = Object.values(TaskStatusValues);
    if (!validValues.includes(value as TaskStatusValue)) {
      throw new Error(
        `TaskStatus must be one of: ${validValues.join(", ")}`
      );
    }
  }

  getValue(): TaskStatusValue {
    return this.value;
  }

  isDone(): boolean {
    return this.value === TaskStatusValues.DONE;
  }

  isArchive(): boolean {
    return this.value === TaskStatusValues.ARCHIVE;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}
