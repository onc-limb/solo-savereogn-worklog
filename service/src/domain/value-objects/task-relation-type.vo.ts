/**
 * TaskRelationType: depends_on, relatedの二つの状態を持つ
 * - depends_on: fromが終わらないとtoができない
 * - related: 単純に関連している
 */
export const TaskRelationTypeValues = {
  DEPENDS_ON: "depends_on",
  RELATED: "related",
} as const;

export type TaskRelationTypeValue =
  (typeof TaskRelationTypeValues)[keyof typeof TaskRelationTypeValues];

export class TaskRelationType {
  private constructor(private readonly value: TaskRelationTypeValue) {}

  static create(value: TaskRelationTypeValue): TaskRelationType {
    this.validate(value);
    return new TaskRelationType(value);
  }

  static dependsOn(): TaskRelationType {
    return new TaskRelationType(TaskRelationTypeValues.DEPENDS_ON);
  }

  static related(): TaskRelationType {
    return new TaskRelationType(TaskRelationTypeValues.RELATED);
  }

  private static validate(value: string): void {
    const validValues = Object.values(TaskRelationTypeValues);
    if (!validValues.includes(value as TaskRelationTypeValue)) {
      throw new Error(
        `TaskRelationType must be one of: ${validValues.join(", ")}`
      );
    }
  }

  getValue(): TaskRelationTypeValue {
    return this.value;
  }

  isDependsOn(): boolean {
    return this.value === TaskRelationTypeValues.DEPENDS_ON;
  }

  isRelated(): boolean {
    return this.value === TaskRelationTypeValues.RELATED;
  }

  equals(other: TaskRelationType): boolean {
    return this.value === other.value;
  }
}
