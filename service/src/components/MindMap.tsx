import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface TaskNode {
    id: string;
    name: string;
    status: string;
    description: string;
    category: string;
}

interface TaskRelation {
    id: string;
    fromTaskId: string;
    toTaskId: string;
    type: string;
}

interface CategoryData {
    id: string;
    name: string;
    icon: string;
    color: string;
    order: number;
}

interface MindMapProps {
    tasks: {
        id: string;
        name: string;
        status: string;
        description: string;
        category: string;
    }[];
    relations: TaskRelation[];
    categories: CategoryData[];
    onTaskClick: (taskId: string) => void;
    selectedTaskId: string | null;
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    backlog: { bg: "bg-gray-700", border: "border-gray-500", text: "text-gray-300" },
    todo: { bg: "bg-blue-700", border: "border-blue-500", text: "text-blue-300" },
    doing: { bg: "bg-yellow-700", border: "border-yellow-500", text: "text-yellow-300" },
    done: { bg: "bg-green-700", border: "border-green-500", text: "text-green-300" },
    archive: { bg: "bg-purple-700", border: "border-purple-500", text: "text-purple-300" },
};

const statusLabels: Record<string, string> = {
    backlog: "バックログ",
    todo: "TODO",
    doing: "進行中",
    done: "完了",
    archive: "アーカイブ",
};

// カテゴリー色のマッピング（colorプロパティ → Tailwindクラス）
const colorMapping: Record<string, { bg: string; border: string; header: string }> = {
    blue: { bg: "bg-blue-900/30", border: "border-blue-600", header: "bg-blue-600" },
    purple: { bg: "bg-purple-900/30", border: "border-purple-600", header: "bg-purple-600" },
    green: { bg: "bg-green-900/30", border: "border-green-600", header: "bg-green-600" },
    orange: { bg: "bg-orange-900/30", border: "border-orange-600", header: "bg-orange-600" },
    cyan: { bg: "bg-cyan-900/30", border: "border-cyan-600", header: "bg-cyan-600" },
    gray: { bg: "bg-gray-900/30", border: "border-gray-600", header: "bg-gray-600" },
    red: { bg: "bg-red-900/30", border: "border-red-600", header: "bg-red-600" },
    yellow: { bg: "bg-yellow-900/30", border: "border-yellow-600", header: "bg-yellow-600" },
    pink: { bg: "bg-pink-900/30", border: "border-pink-600", header: "bg-pink-600" },
    indigo: { bg: "bg-indigo-900/30", border: "border-indigo-600", header: "bg-indigo-600" },
};

export function MindMap({ tasks, relations, categories, onTaskClick, selectedTaskId }: MindMapProps) {
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [taskPositions, setTaskPositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());

    // タスクの位置を更新
    useEffect(() => {
        const updatePositions = () => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const newPositions = new Map<string, { x: number; y: number; width: number; height: number }>();

            taskRefs.current.forEach((element, taskId) => {
                const rect = element.getBoundingClientRect();
                newPositions.set(taskId, {
                    x: rect.left - containerRect.left + containerRef.current!.scrollLeft,
                    y: rect.top - containerRect.top + containerRef.current!.scrollTop,
                    width: rect.width,
                    height: rect.height,
                });
            });

            setTaskPositions(newPositions);
        };

        // 少し遅延させてDOMが確定してから位置を取得
        const timer = setTimeout(updatePositions, 100);
        window.addEventListener('resize', updatePositions);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePositions);
        };
    }, [tasks, categories]);

    // カテゴリーをorderでソート
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => a.order - b.order);
    }, [categories]);

    // タスクをカテゴリーごとにグループ化
    const tasksByCategory = useMemo(() => {
        const grouped: Record<string, TaskNode[]> = {};

        // 全カテゴリーを初期化
        sortedCategories.forEach(cat => {
            grouped[cat.id] = [];
        });

        tasks.forEach(task => {
            const categoryId = task.category || "";
            if (!grouped[categoryId]) {
                grouped[categoryId] = [];
            }
            grouped[categoryId].push(task);
        });

        return grouped;
    }, [tasks, sortedCategories]);

    // 表示するカテゴリー（タスクがあるもののみ）
    const activeCategories = useMemo(() => {
        return sortedCategories.filter(cat => tasksByCategory[cat.id]?.length > 0);
    }, [sortedCategories, tasksByCategory]);

    const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedTask(null);
    }, []);

    // 接続線の描画
    const renderConnections = useMemo(() => {
        if (taskPositions.size === 0) return null;

        return relations.map((rel) => {
            const fromPos = taskPositions.get(rel.fromTaskId);
            const toPos = taskPositions.get(rel.toTaskId);

            if (!fromPos || !toPos) return null;

            // 中心点を計算
            const x1 = fromPos.x + fromPos.width / 2;
            const y1 = fromPos.y + fromPos.height / 2;
            const x2 = toPos.x + toPos.width / 2;
            const y2 = toPos.y + toPos.height / 2;

            // ベジエ曲線のコントロールポイント
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const dx = x2 - x1;
            const dy = y2 - y1;

            // カーブの強さを距離に応じて調整
            const curveStrength = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;

            let path: string;
            if (Math.abs(dx) > Math.abs(dy)) {
                // 横方向が長い場合
                path = `M ${x1} ${y1} Q ${midX} ${y1 + curveStrength}, ${midX} ${midY} Q ${midX} ${y2 - curveStrength}, ${x2} ${y2}`;
            } else {
                // 縦方向が長い場合
                path = `M ${x1} ${y1} Q ${x1 + curveStrength} ${midY}, ${midX} ${midY} Q ${x2 - curveStrength} ${midY}, ${x2} ${y2}`;
            }

            const isDependsOn = rel.type === "depends_on";
            const strokeColor = isDependsOn ? "#60a5fa" : "#a78bfa";
            const strokeDasharray = isDependsOn ? "none" : "8,4";

            return (
                <g key={rel.id}>
                    <path
                        d={path}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeDasharray={strokeDasharray}
                        markerEnd={`url(#arrowhead-${isDependsOn ? 'depends' : 'related'})`}
                        opacity="0.7"
                    />
                </g>
            );
        });
    }, [relations, taskPositions]);

    const setTaskRef = useCallback((taskId: string, element: HTMLDivElement | null) => {
        if (element) {
            taskRefs.current.set(taskId, element);
        } else {
            taskRefs.current.delete(taskId);
        }
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-slate-900 overflow-auto p-6">
            {/* SVG for connections */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ minWidth: "100%", minHeight: "100%", zIndex: 1 }}
            >
                <defs>
                    <marker
                        id="arrowhead-depends"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                    </marker>
                    <marker
                        id="arrowhead-related"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#a78bfa" />
                    </marker>
                </defs>
                {renderConnections}
            </svg>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-full" style={{ zIndex: 2 }}>
                {activeCategories.map((category) => {
                    const categoryTasks = tasksByCategory[category.id] || [];
                    const colors = colorMapping[category.color] || colorMapping.gray;
                    const label = `${category.icon} ${category.name}`;

                    return (
                        <div
                            key={category.id}
                            className={`rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden`}
                        >
                            {/* カテゴリーヘッダー */}
                            <div className={`${colors.header} px-4 py-3`}>
                                <h3 className="text-white font-bold text-lg">
                                    {label}
                                    <span className="ml-2 text-white/70 text-sm font-normal">
                                        ({categoryTasks.length})
                                    </span>
                                </h3>
                            </div>

                            {/* タスクリスト */}
                            <div className="p-4 space-y-3">
                                {categoryTasks.length === 0 ? (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        タスクがありません
                                    </p>
                                ) : (
                                    categoryTasks.map((task) => {
                                        const taskColors = statusColors[task.status] || statusColors.backlog;
                                        const isSelected = selectedTaskId === task.id;
                                        const isDragging = draggedTask === task.id;

                                        return (
                                            <div
                                                key={task.id}
                                                ref={(el) => setTaskRef(task.id, el)}
                                                data-task-id={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onDragEnd={handleDragEnd}
                                                onClick={() => onTaskClick(task.id)}
                                                className={`
                                                    cursor-pointer transition-all duration-200 rounded-lg p-4 border-2
                                                    ${taskColors.bg} ${taskColors.border}
                                                    ${isSelected ? "ring-4 ring-cyan-400 scale-[1.02]" : "hover:scale-[1.01]"}
                                                    ${isDragging ? "opacity-50" : ""}
                                                `}
                                            >
                                                <div className="text-white font-semibold text-sm truncate mb-2">
                                                    {task.name}
                                                </div>
                                                <div className={`text-xs ${taskColors.text} mb-2`}>
                                                    {statusLabels[task.status]}
                                                </div>
                                                <div className="text-gray-400 text-xs line-clamp-2">
                                                    {task.description || "説明なし"}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 空の場合のメッセージ */}
                {activeCategories.length === 0 && (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <p className="text-gray-500 text-lg">タスクがありません</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="fixed bottom-4 left-4 bg-slate-800/90 rounded-lg p-4 z-20">
                <div className="text-white text-sm font-semibold mb-2">凡例</div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(statusLabels).map(([status, label]) => {
                        const colors = statusColors[status];
                        return (
                            <div key={status} className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`} />
                                <span className="text-gray-300 text-xs">{label}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2">
                    <div className="text-white text-xs font-semibold mb-1">関係性</div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <svg width="24" height="8">
                                <line x1="0" y1="4" x2="20" y2="4" stroke="#60a5fa" strokeWidth="2" />
                                <polygon points="20 1, 24 4, 20 7" fill="#60a5fa" />
                            </svg>
                            <span className="text-gray-300 text-xs">依存</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg width="24" height="8">
                                <line x1="0" y1="4" x2="20" y2="4" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4,2" />
                                <polygon points="20 1, 24 4, 20 7" fill="#a78bfa" />
                            </svg>
                            <span className="text-gray-300 text-xs">関連</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
