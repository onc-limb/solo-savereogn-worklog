import { TaskEntity } from "../domain/entities/task.entity";
import { TaskRelationEntity } from "../domain/entities/task-relation.entity";
import { WorkNoteEntity } from "../domain/entities/work-note.entity";
import { DailyReportEntity } from "../domain/entities/daily-report.entity";
import { ITaskRepository } from "../domain/repositories/task.repository";
import { ITaskRelationRepository } from "../domain/repositories/task-relation.repository";
import { IWorkNoteRepository } from "../domain/repositories/work-note.repository";
import { IDailyReportRepository } from "../domain/repositories/daily-report.repository";
import {
  initialTasks,
  initialTaskRelations,
  initialWorkNotes,
  initialDailyReports,
  TaskData,
  TaskRelationData,
  WorkNoteData,
  DailyReportData,
} from "./mock-data";

// インメモリストア
let tasksStore: TaskData[] = [...initialTasks];
let taskRelationsStore: TaskRelationData[] = [...initialTaskRelations];
let workNotesStore: WorkNoteData[] = [...initialWorkNotes];
let dailyReportsStore: DailyReportData[] = [...initialDailyReports];

/**
 * モックタスクリポジトリ
 */
export class MockTaskRepository implements ITaskRepository {
  async findById(id: string): Promise<TaskEntity | null> {
    const data = tasksStore.find((t) => t.id === id);
    if (!data) return null;
    return TaskEntity.reconstruct(data);
  }

  async findAll(): Promise<TaskEntity[]> {
    return tasksStore.map((data) => TaskEntity.reconstruct(data));
  }

  async findByStatus(status: string): Promise<TaskEntity[]> {
    return tasksStore
      .filter((t) => t.status === status)
      .map((data) => TaskEntity.reconstruct(data));
  }

  async findByIsComplete(isComplete: boolean): Promise<TaskEntity[]> {
    return tasksStore
      .filter((t) => t.isComplete === isComplete)
      .map((data) => TaskEntity.reconstruct(data));
  }

  async save(task: TaskEntity): Promise<void> {
    const plain = task.toPlainObject();
    const index = tasksStore.findIndex((t) => t.id === plain.id);
    if (index >= 0) {
      tasksStore[index] = plain;
    } else {
      tasksStore.push(plain);
    }
  }

  async delete(id: string): Promise<void> {
    tasksStore = tasksStore.filter((t) => t.id !== id);
  }
}

/**
 * モックタスク関連リポジトリ
 */
export class MockTaskRelationRepository implements ITaskRelationRepository {
  async findById(id: string): Promise<TaskRelationEntity | null> {
    const data = taskRelationsStore.find((r) => r.id === id);
    if (!data) return null;
    return TaskRelationEntity.reconstruct(data);
  }

  async findAll(): Promise<TaskRelationEntity[]> {
    return taskRelationsStore.map((data) =>
      TaskRelationEntity.reconstruct(data)
    );
  }

  async findByFromTaskId(fromTaskId: string): Promise<TaskRelationEntity[]> {
    return taskRelationsStore
      .filter((r) => r.fromTaskId === fromTaskId)
      .map((data) => TaskRelationEntity.reconstruct(data));
  }

  async findByToTaskId(toTaskId: string): Promise<TaskRelationEntity[]> {
    return taskRelationsStore
      .filter((r) => r.toTaskId === toTaskId)
      .map((data) => TaskRelationEntity.reconstruct(data));
  }

  async findByTaskId(taskId: string): Promise<TaskRelationEntity[]> {
    return taskRelationsStore
      .filter((r) => r.fromTaskId === taskId || r.toTaskId === taskId)
      .map((data) => TaskRelationEntity.reconstruct(data));
  }

  async save(taskRelation: TaskRelationEntity): Promise<void> {
    const plain = taskRelation.toPlainObject();
    const index = taskRelationsStore.findIndex((r) => r.id === plain.id);
    if (index >= 0) {
      taskRelationsStore[index] = plain;
    } else {
      taskRelationsStore.push(plain);
    }
  }

  async delete(id: string): Promise<void> {
    taskRelationsStore = taskRelationsStore.filter((r) => r.id !== id);
  }
}

/**
 * モック作業メモリポジトリ
 */
export class MockWorkNoteRepository implements IWorkNoteRepository {
  async findById(id: string): Promise<WorkNoteEntity | null> {
    const data = workNotesStore.find((n) => n.id === id);
    if (!data) return null;
    return WorkNoteEntity.reconstruct(data);
  }

  async findAll(): Promise<WorkNoteEntity[]> {
    return workNotesStore.map((data) => WorkNoteEntity.reconstruct(data));
  }

  async findByTaskId(taskId: string): Promise<WorkNoteEntity[]> {
    return workNotesStore
      .filter((n) => n.taskId === taskId)
      .map((data) => WorkNoteEntity.reconstruct(data));
  }

  async findByDate(date: string): Promise<WorkNoteEntity[]> {
    return workNotesStore
      .filter((n) => n.date === date)
      .map((data) => WorkNoteEntity.reconstruct(data));
  }

  async findByTaskIdAndDate(
    taskId: string,
    date: string
  ): Promise<WorkNoteEntity | null> {
    const data = workNotesStore.find(
      (n) => n.taskId === taskId && n.date === date
    );
    if (!data) return null;
    return WorkNoteEntity.reconstruct(data);
  }

  async save(workNote: WorkNoteEntity): Promise<void> {
    const plain = workNote.toPlainObject();
    const index = workNotesStore.findIndex((n) => n.id === plain.id);
    if (index >= 0) {
      workNotesStore[index] = plain;
    } else {
      workNotesStore.push(plain);
    }
  }

  async delete(id: string): Promise<void> {
    workNotesStore = workNotesStore.filter((n) => n.id !== id);
  }
}

/**
 * モック日報リポジトリ
 */
export class MockDailyReportRepository implements IDailyReportRepository {
  async findById(id: string): Promise<DailyReportEntity | null> {
    const data = dailyReportsStore.find((r) => r.id === id);
    if (!data) return null;
    return DailyReportEntity.reconstruct(data);
  }

  async findAll(): Promise<DailyReportEntity[]> {
    return dailyReportsStore.map((data) => DailyReportEntity.reconstruct(data));
  }

  async findByDate(date: string): Promise<DailyReportEntity | null> {
    const data = dailyReportsStore.find((r) => r.date === date);
    if (!data) return null;
    return DailyReportEntity.reconstruct(data);
  }

  async save(dailyReport: DailyReportEntity): Promise<void> {
    const plain = dailyReport.toPlainObject();
    const index = dailyReportsStore.findIndex((r) => r.id === plain.id);
    if (index >= 0) {
      dailyReportsStore[index] = plain;
    } else {
      dailyReportsStore.push(plain);
    }
  }

  async delete(id: string): Promise<void> {
    dailyReportsStore = dailyReportsStore.filter((r) => r.id !== id);
  }
}

// リポジトリのシングルトンインスタンス
export const taskRepository = new MockTaskRepository();
export const taskRelationRepository = new MockTaskRelationRepository();
export const workNoteRepository = new MockWorkNoteRepository();
export const dailyReportRepository = new MockDailyReportRepository();
