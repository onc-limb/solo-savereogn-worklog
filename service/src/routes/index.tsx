import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { MindMap } from "../components/MindMap";
import { TaskDetailPanel } from "../components/TaskDetailPanel";
import {
  getTasks,
  getTaskRelations,
  getWorkNotesByTaskId,
  createTask,
  updateTaskStatus,
  updateTaskName,
  updateTaskDescription,
  updateTaskCategory,
  createWorkNote,
  updateWorkNote,
  deleteWorkNote,
  getCategories,
} from "../server/functions";

export const Route = createFileRoute("/")({
  component: TaskListPage,
  loader: async () => {
    const [tasks, relations, categories] = await Promise.all([
      getTasks(),
      getTaskRelations(),
      getCategories(),
    ]);
    return { tasks, relations, categories };
  },
});

function TaskListPage() {
  const { tasks: initialTasks, relations: initialRelations, categories: initialCategories } =
    Route.useLoaderData();

  const [tasks, setTasks] = useState(initialTasks);
  const [relations, setRelations] = useState(initialRelations);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [workNotes, setWorkNotes] = useState<
    { id: string; taskId: string; date: string; note: string }[]
  >([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleRefresh = useCallback(async () => {
    const [newTasks, newRelations, newCategories] = await Promise.all([
      getTasks(),
      getTaskRelations(),
      getCategories(),
    ]);
    setTasks(newTasks);
    setRelations(newRelations);
    setCategories(newCategories);
  }, []);

  const handleTaskClick = useCallback(async (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsPanelOpen(true);
    const notes = await getWorkNotesByTaskId({ data: taskId });
    setWorkNotes(notes);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedTaskId(null);
    setIsFullScreen(false);
  }, []);

  const handleToggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const handleUpdateTask = useCallback(
    async (data: {
      id: string;
      name?: string;
      description?: string;
      status?: string;
    }) => {
      if (data.name !== undefined) {
        await updateTaskName({ data: { id: data.id, name: data.name } });
      }
      if (data.description !== undefined) {
        await updateTaskDescription({
          data: { id: data.id, description: data.description },
        });
      }
      if (data.status !== undefined) {
        await updateTaskStatus({
          data: { id: data.id, status: data.status },
        });
      }
      await handleRefresh();
    },
    [handleRefresh]
  );

  const handleUpdateCategory = useCallback(
    async (data: { id: string; category: string }) => {
      await updateTaskCategory({ data });
      await handleRefresh();
    },
    [handleRefresh]
  );

  const handleAddWorkNote = useCallback(
    async (data: { taskId: string; note: string }) => {
      await createWorkNote({ data });
      const notes = await getWorkNotesByTaskId({ data: data.taskId });
      setWorkNotes(notes);
    },
    []
  );

  const handleUpdateWorkNote = useCallback(
    async (data: { id: string; note: string }) => {
      await updateWorkNote({ data });
      if (selectedTaskId) {
        const notes = await getWorkNotesByTaskId({ data: selectedTaskId });
        setWorkNotes(notes);
      }
    },
    [selectedTaskId]
  );

  const handleDeleteWorkNote = useCallback(
    async (id: string) => {
      await deleteWorkNote({ data: id });
      if (selectedTaskId) {
        const notes = await getWorkNotesByTaskId({ data: selectedTaskId });
        setWorkNotes(notes);
      }
    },
    [selectedTaskId]
  );

  const handleAddTask = useCallback(async () => {
    if (!newTaskName.trim()) return;
    await createTask({ data: { name: newTaskName } });
    setNewTaskName("");
    setIsAddingTask(false);
    await handleRefresh();
  }, [newTaskName, handleRefresh]);

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">タスク一覧</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            更新
          </button>
          {isAddingTask ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="タスク名を入力..."
                className="px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") {
                    setIsAddingTask(false);
                    setNewTaskName("");
                  }
                }}
              />
              <button
                onClick={handleAddTask}
                disabled={!newTaskName.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskName("");
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              タスク追加
            </button>
          )}
        </div>
      </div>

      {/* Mind Map */}
      <div className="flex-1 relative">
        <MindMap
          tasks={tasks}
          relations={relations}
          categories={categories}
          onTaskClick={handleTaskClick}
          selectedTaskId={selectedTaskId}
        />
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        task={selectedTask}
        workNotes={workNotes}
        categories={categories}
        isOpen={isPanelOpen}
        isFullScreen={isFullScreen}
        onClose={handleClosePanel}
        onToggleFullScreen={handleToggleFullScreen}
        onUpdateTask={handleUpdateTask}
        onUpdateCategory={handleUpdateCategory}
        onAddWorkNote={handleAddWorkNote}
        onUpdateWorkNote={handleUpdateWorkNote}
        onDeleteWorkNote={handleDeleteWorkNote}
      />

      {/* Overlay when panel is open */}
      {isPanelOpen && !isFullScreen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={handleClosePanel}
        />
      )}
    </div>
  );
}
