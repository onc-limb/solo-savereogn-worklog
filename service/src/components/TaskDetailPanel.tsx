import { useState, useEffect } from "react";
import { X, Maximize2, Minimize2, Plus, Save, Trash2 } from "lucide-react";

interface TaskData {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isComplete: boolean;
    status: string;
    description: string;
    summary: string;
}

interface WorkNoteData {
    id: string;
    taskId: string;
    date: string;
    note: string;
}

interface TaskDetailPanelProps {
    task: TaskData | null;
    workNotes: WorkNoteData[];
    isOpen: boolean;
    isFullScreen: boolean;
    onClose: () => void;
    onToggleFullScreen: () => void;
    onUpdateTask: (data: { id: string; name?: string; description?: string; status?: string }) => void;
    onAddWorkNote: (data: { taskId: string; note: string }) => void;
    onUpdateWorkNote: (data: { id: string; note: string }) => void;
    onDeleteWorkNote: (id: string) => void;
}

const statusOptions = [
    { value: "backlog", label: "バックログ" },
    { value: "todo", label: "TODO" },
    { value: "doing", label: "進行中" },
    { value: "done", label: "完了" },
    { value: "archive", label: "アーカイブ" },
];

export function TaskDetailPanel({
    task,
    workNotes,
    isOpen,
    isFullScreen,
    onClose,
    onToggleFullScreen,
    onUpdateTask,
    onAddWorkNote,
    onUpdateWorkNote,
    onDeleteWorkNote,
}: TaskDetailPanelProps) {
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(task?.name || "");
    const [description, setDescription] = useState(task?.description || "");
    const [status, setStatus] = useState(task?.status || "backlog");
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteContent, setEditingNoteContent] = useState("");

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
            setStatus(task.status);
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSaveName = () => {
        if (name !== task.name) {
            onUpdateTask({ id: task.id, name });
        }
        setEditingName(false);
    };

    const handleSaveDescription = () => {
        if (description !== task.description) {
            onUpdateTask({ id: task.id, description });
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        onUpdateTask({ id: task.id, status: newStatus });
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAddWorkNote({ taskId: task.id, note: newNote });
            setNewNote("");
        }
    };

    const handleSaveNote = (noteId: string) => {
        if (editingNoteContent.trim()) {
            onUpdateWorkNote({ id: noteId, note: editingNoteContent });
        }
        setEditingNoteId(null);
    };

    const panelClasses = isFullScreen
        ? "fixed inset-0 z-50 bg-slate-800"
        : "fixed right-0 top-0 h-full w-[480px] max-w-full z-40 bg-slate-800 shadow-2xl";

    return (
        <div className={panelClasses}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleFullScreen}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title={isFullScreen ? "縮小" : "全画面"}
                        >
                            {isFullScreen ? (
                                <Minimize2 className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Maximize2 className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Task Name */}
                    <div>
                        {editingName ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-slate-700 text-white text-xl font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    autoFocus
                                    onBlur={handleSaveName}
                                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                                />
                            </div>
                        ) : (
                            <h2
                                className="text-xl font-bold text-white cursor-pointer hover:text-cyan-400 transition-colors"
                                onClick={() => setEditingName(true)}
                            >
                                {task.name}
                            </h2>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            ステータス
                        </label>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            説明
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleSaveDescription}
                            rows={4}
                            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                            placeholder="タスクの説明を入力..."
                        />
                    </div>

                    {/* Meta Info */}
                    <div className="flex gap-6 text-sm text-gray-400">
                        <div>
                            <span className="font-medium">作成日:</span> {task.createdAt}
                        </div>
                        <div>
                            <span className="font-medium">更新日:</span> {task.updatedAt}
                        </div>
                    </div>

                    {/* Work Notes */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">作業メモ</h3>

                        {/* Add new note */}
                        <div className="mb-4">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                                placeholder="新しい作業メモを入力..."
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={!newNote.trim()}
                                className="mt-2 flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                メモを追加
                            </button>
                        </div>

                        {/* Notes list */}
                        <div className="space-y-3">
                            {workNotes.length === 0 ? (
                                <p className="text-gray-500 text-sm">作業メモはありません</p>
                            ) : (
                                workNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-slate-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-cyan-400">{note.date}</span>
                                            <div className="flex gap-1">
                                                {editingNoteId === note.id ? (
                                                    <button
                                                        onClick={() => handleSaveNote(note.id)}
                                                        className="p-1 hover:bg-slate-600 rounded transition-colors"
                                                    >
                                                        <Save className="w-4 h-4 text-green-400" />
                                                    </button>
                                                ) : null}
                                                <button
                                                    onClick={() => onDeleteWorkNote(note.id)}
                                                    className="p-1 hover:bg-slate-600 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                        {editingNoteId === note.id ? (
                                            <textarea
                                                value={editingNoteContent}
                                                onChange={(e) => setEditingNoteContent(e.target.value)}
                                                className="w-full bg-slate-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                                                rows={3}
                                                autoFocus
                                            />
                                        ) : (
                                            <p
                                                className="text-gray-300 text-sm whitespace-pre-wrap cursor-pointer hover:bg-slate-600 p-2 -m-2 rounded transition-colors"
                                                onClick={() => {
                                                    setEditingNoteId(note.id);
                                                    setEditingNoteContent(note.note);
                                                }}
                                            >
                                                {note.note}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Summary (if done) */}
                    {task.summary && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">タスク要約</h3>
                            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                                <p className="text-green-300 text-sm whitespace-pre-wrap">
                                    {task.summary}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
