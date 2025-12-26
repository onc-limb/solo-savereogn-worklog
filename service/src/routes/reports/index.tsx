import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Calendar, FileText, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
    getDailyReports,
    getWorkNotesByDate,
    createDailyReport,
    deleteDailyReport,
    getTasks,
} from "../../server/functions";

export const Route = createFileRoute("/reports/" as any)({
    component: ReportsPage,
    loader: async () => {
        const [reports, tasks] = await Promise.all([getDailyReports(), getTasks()]);
        return { reports, tasks };
    },
});

interface TaskData {
    id: string;
    name: string;
    status: string;
}

interface DailyReportData {
    id: string;
    date: string;
    summary: string;
    createdAt: string;
}

function ReportsPage() {
    const { reports: initialReports, tasks } = Route.useLoaderData() as {
        reports: DailyReportData[];
        tasks: TaskData[];
    };
    const [reports, setReports] = useState(initialReports);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [previewNotes, setPreviewNotes] = useState<
        { id: string; taskId: string; date: string; note: string }[]
    >([]);
    const [isCreating, setIsCreating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleRefresh = useCallback(async () => {
        const newReports = await getDailyReports();
        setReports(newReports);
    }, []);

    const handleDateChange = useCallback(
        async (date: string) => {
            setSelectedDate(date);
            const notes = await getWorkNotesByDate({ data: date });
            setPreviewNotes(notes);
            setShowPreview(true);
        },
        []
    );

    const handleCreateReport = useCallback(async () => {
        setIsCreating(true);
        try {
            await createDailyReport({ data: { date: selectedDate } });
            await handleRefresh();
            setShowPreview(false);
        } finally {
            setIsCreating(false);
        }
    }, [selectedDate, handleRefresh]);

    const handleDeleteReport = useCallback(
        async (id: string) => {
            if (confirm("この日報を削除しますか？")) {
                await deleteDailyReport({ data: id });
                await handleRefresh();
            }
        },
        [handleRefresh]
    );

    const getTaskName = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        return task?.name ?? "不明なタスク";
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-cyan-400" />
                        日報一覧
                    </h1>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        更新
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create New Report Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-cyan-400" />
                                日報作成
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        日付を選択
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateReport}
                                    disabled={isCreating}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    {isCreating ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            作成中...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            日報を作成
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Preview Section */}
                            {showPreview && (
                                <div className="mt-6 pt-6 border-t border-slate-700">
                                    <h3 className="text-sm font-medium text-gray-400 mb-3">
                                        {selectedDate} の作業メモ ({previewNotes.length}件)
                                    </h3>
                                    {previewNotes.length === 0 ? (
                                        <p className="text-gray-500 text-sm">
                                            この日の作業メモはありません
                                        </p>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {previewNotes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="bg-slate-700/50 rounded-lg p-3"
                                                >
                                                    <div className="text-cyan-400 text-xs mb-1">
                                                        {getTaskName(note.taskId)}
                                                    </div>
                                                    <p className="text-gray-300 text-sm line-clamp-2">
                                                        {note.note}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold text-white mb-4">
                                作成済み日報
                            </h2>

                            {reports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500">日報はまだありません</p>
                                    <p className="text-gray-600 text-sm mt-2">
                                        左のフォームから日報を作成してください
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reports
                                        .sort((a, b) => b.date.localeCompare(a.date))
                                        .map((report) => (
                                            <div
                                                key={report.id}
                                                className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <Link
                                                        to={"/reports/$reportId" as any}
                                                        params={{ reportId: report.id } as any}
                                                        className="flex-1"
                                                    >
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Calendar className="w-5 h-5 text-cyan-400" />
                                                            <span className="text-lg font-medium text-white">
                                                                {report.date}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm line-clamp-2 ml-8">
                                                            {report.summary.substring(0, 100)}...
                                                        </p>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteReport(report.id)}
                                                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                                <div className="ml-8 mt-2 text-xs text-gray-500">
                                                    作成日: {report.createdAt}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
