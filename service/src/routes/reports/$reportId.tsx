import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { getDailyReport } from "../../server/functions";

interface ReportData {
    id: string;
    date: string;
    summary: string;
    createdAt: string;
}

export const Route = createFileRoute("/reports/$reportId" as any)({
    component: ReportDetailPage,
    loader: async ({ params }: { params: { reportId: string } }) => {
        const report = await getDailyReport({ data: params.reportId });
        if (!report) {
            throw new Error("Report not found");
        }
        return { report };
    },
});

function ReportDetailPage() {
    const { report } = Route.useLoaderData() as { report: ReportData };

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    to={"/reports" as any}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    日報一覧に戻る
                </Link>

                {/* Header */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-cyan-600/20 rounded-xl">
                            <FileText className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-cyan-400" />
                                {report.date} の日報
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                作成日: {report.createdAt}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <h2 className="text-lg font-semibold text-white mb-4">内容</h2>
                    <div className="prose prose-invert max-w-none">
                        <div className="bg-slate-700/50 rounded-lg p-6 whitespace-pre-wrap text-gray-300 leading-relaxed">
                            {report.summary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
