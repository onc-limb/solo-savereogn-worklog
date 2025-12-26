/**
 * TaskCategory: タスクのカテゴリーを表すValue Object
 */
export const TaskCategoryValues = {
  PLANNING: "planning",
  DESIGN: "design",
  DEVELOPMENT: "development",
  TESTING: "testing",
  DOCUMENTATION: "documentation",
  OTHER: "other",
} as const;

export type TaskCategoryValue =
  (typeof TaskCategoryValues)[keyof typeof TaskCategoryValues];

export class TaskCategory {
  private constructor(private readonly value: TaskCategoryValue) {}

  static create(value: TaskCategoryValue): TaskCategory {
    this.validate(value);
    return new TaskCategory(value);
  }

  static planning(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.PLANNING);
  }

  static design(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.DESIGN);
  }

  static development(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.DEVELOPMENT);
  }

  static testing(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.TESTING);
  }

  static documentation(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.DOCUMENTATION);
  }

  static other(): TaskCategory {
    return new TaskCategory(TaskCategoryValues.OTHER);
  }

  private static validate(value: string): void {
    const validValues = Object.values(TaskCategoryValues);
    if (!validValues.includes(value as TaskCategoryValue)) {
      throw new Error(`TaskCategory must be one of: ${validValues.join(", ")}`);
    }
  }

  getValue(): TaskCategoryValue {
    return this.value;
  }

  isPlanning(): boolean {
    return this.value === TaskCategoryValues.PLANNING;
  }

  isDesign(): boolean {
    return this.value === TaskCategoryValues.DESIGN;
  }

  isDevelopment(): boolean {
    return this.value === TaskCategoryValues.DEVELOPMENT;
  }

  isTesting(): boolean {
    return this.value === TaskCategoryValues.TESTING;
  }

  isDocumentation(): boolean {
    return this.value === TaskCategoryValues.DOCUMENTATION;
  }

  isOther(): boolean {
    return this.value === TaskCategoryValues.OTHER;
  }

  equals(other: TaskCategory): boolean {
    return this.value === other.value;
  }
}
