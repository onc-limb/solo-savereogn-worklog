import { createServerFn } from "@tanstack/react-start";
import {
  taskRepository,
  taskRelationRepository,
  workNoteRepository,
  dailyReportRepository,
  categoryRepository,
} from "../infrastructure/mock-repositories";
import { TaskEntity } from "../domain/entities/task.entity";
import { TaskRelationEntity } from "../domain/entities/task-relation.entity";
import { WorkNoteEntity } from "../domain/entities/work-note.entity";
import { DailyReportEntity } from "../domain/entities/daily-report.entity";
import { CategoryEntity } from "../domain/entities/category.entity";

// ====== タスク関連 ======

export const getTasks = createServerFn({ method: "GET" }).handler(async () => {
  const tasks = await taskRepository.findAll();
  return tasks.map((t) => t.toPlainObject());
});

export const getTask = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const task = await taskRepository.findById(id);
    return task?.toPlainObject() ?? null;
  });

export const createTask = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; description?: string; category?: string }) => data)
  .handler(async ({ data }) => {
    const task = TaskEntity.create(data);
    await taskRepository.save(task);
    return task.toPlainObject();
  });

export const updateTaskStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const task = await taskRepository.findById(data.id);
    if (!task) throw new Error("Task not found");

    // Dynamic import to avoid circular dependency
    const { TaskStatus } = await import(
      "../domain/value-objects/task-status.vo"
    );
    task.updateStatus(
      TaskStatus.create(data.status as Parameters<typeof TaskStatus.create>[0])
    );
    await taskRepository.save(task);
    return task.toPlainObject();
  });

export const updateTaskName = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; name: string }) => data)
  .handler(async ({ data }) => {
    const task = await taskRepository.findById(data.id);
    if (!task) throw new Error("Task not found");
    task.updateName(data.name);
    await taskRepository.save(task);
    return task.toPlainObject();
  });

export const updateTaskDescription = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; description: string }) => data)
  .handler(async ({ data }) => {
    const task = await taskRepository.findById(data.id);
    if (!task) throw new Error("Task not found");
    task.updateDescription(data.description);
    await taskRepository.save(task);
    return task.toPlainObject();
  });

export const updateTaskCategory = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; category: string }) => data)
  .handler(async ({ data }) => {
    const task = await taskRepository.findById(data.id);
    if (!task) throw new Error("Task not found");
    // カテゴリーはIDとして保存（バリデーションは任意）
    task.updateCategoryId(data.category);
    await taskRepository.save(task);
    return task.toPlainObject();
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    await taskRepository.delete(id);
    return { success: true };
  });

// ====== タスク関連 ======

export const getTaskRelations = createServerFn({ method: "GET" }).handler(
  async () => {
    const relations = await taskRelationRepository.findAll();
    return relations.map((r) => r.toPlainObject());
  }
);

export const createTaskRelation = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      fromTaskId: string;
      toTaskId: string;
      type: "depends_on" | "related";
    }) => data
  )
  .handler(async ({ data }) => {
    const relation = TaskRelationEntity.create(data);
    await taskRelationRepository.save(relation);
    return relation.toPlainObject();
  });

export const deleteTaskRelation = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    await taskRelationRepository.delete(id);
    return { success: true };
  });

// ====== 作業メモ ======

export const getWorkNotes = createServerFn({ method: "GET" }).handler(
  async () => {
    const notes = await workNoteRepository.findAll();
    return notes.map((n) => n.toPlainObject());
  }
);

export const getWorkNotesByTaskId = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: taskId }) => {
    const notes = await workNoteRepository.findByTaskId(taskId);
    return notes.map((n) => n.toPlainObject());
  });

export const getWorkNotesByDate = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: date }) => {
    const notes = await workNoteRepository.findByDate(date);
    return notes.map((n) => n.toPlainObject());
  });

export const createWorkNote = createServerFn({ method: "POST" })
  .inputValidator((data: { taskId: string; date?: string; note?: string }) => data)
  .handler(async ({ data }) => {
    const note = WorkNoteEntity.create(data);
    await workNoteRepository.save(note);
    return note.toPlainObject();
  });

export const updateWorkNote = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; note: string }) => data)
  .handler(async ({ data }) => {
    const note = await workNoteRepository.findById(data.id);
    if (!note) throw new Error("WorkNote not found");
    note.updateNote(data.note);
    await workNoteRepository.save(note);
    return note.toPlainObject();
  });

export const deleteWorkNote = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    await workNoteRepository.delete(id);
    return { success: true };
  });

// ====== 日報 ======

export const getDailyReports = createServerFn({ method: "GET" }).handler(
  async () => {
    const reports = await dailyReportRepository.findAll();
    return reports.map((r) => r.toPlainObject());
  }
);

export const getDailyReport = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const report = await dailyReportRepository.findById(id);
    return report?.toPlainObject() ?? null;
  });

export const getDailyReportByDate = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: date }) => {
    const report = await dailyReportRepository.findByDate(date);
    return report?.toPlainObject() ?? null;
  });

export const createDailyReport = createServerFn({ method: "POST" })
  .inputValidator((data: { date: string }) => data)
  .handler(async ({ data }) => {
    // 指定日の作業メモを取得
    const notes = await workNoteRepository.findByDate(data.date);
    const tasks = await taskRepository.findAll();

    // 作業メモを要約（実際のLLMの代わりにモックで生成）
    let summary = `## ${data.date} の日報\n\n`;

    if (notes.length === 0) {
      summary += "本日の作業メモはありません。";
    } else {
      summary += "### 本日の作業内容\n\n";
      notes.forEach((note) => {
        const task = tasks.find((t) => t.getId() === note.getTaskId());
        const taskName = task?.getName() ?? "不明なタスク";
        summary += `#### ${taskName}\n${note.getNote()}\n\n`;
      });
    }

    // 既存の日報があれば更新、なければ新規作成
    const existing = await dailyReportRepository.findByDate(data.date);
    if (existing) {
      existing.updateSummary(summary);
      await dailyReportRepository.save(existing);
      return existing.toPlainObject();
    }

    const report = DailyReportEntity.create({ date: data.date, summary });
    await dailyReportRepository.save(report);
    return report.toPlainObject();
  });

export const deleteDailyReport = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    await dailyReportRepository.delete(id);
    return { success: true };
  });

// ====== カテゴリー ======

export const getCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const categories = await categoryRepository.findAll();
    return categories.map((c) => c.toPlainObject());
  }
);

export const getCategory = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const category = await categoryRepository.findById(id);
    return category?.toPlainObject() ?? null;
  });

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { name: string; icon?: string; color?: string; order?: number }) =>
      data
  )
  .handler(async ({ data }) => {
    const category = CategoryEntity.create(data);
    await categoryRepository.save(category);
    return category.toPlainObject();
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string; name?: string; icon?: string; color?: string }) => data
  )
  .handler(async ({ data }) => {
    const category = await categoryRepository.findById(data.id);
    if (!category) throw new Error("Category not found");

    if (data.name !== undefined) {
      category.updateName(data.name);
    }
    if (data.icon !== undefined) {
      category.updateIcon(data.icon);
    }
    if (data.color !== undefined) {
      category.updateColor(data.color);
    }

    await categoryRepository.save(category);
    return category.toPlainObject();
  });

export const updateCategoryOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; order: number }) => data)
  .handler(async ({ data }) => {
    const category = await categoryRepository.findById(data.id);
    if (!category) throw new Error("Category not found");
    category.updateOrder(data.order);
    await categoryRepository.save(category);
    return category.toPlainObject();
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    await categoryRepository.delete(id);
    return { success: true };
  });
