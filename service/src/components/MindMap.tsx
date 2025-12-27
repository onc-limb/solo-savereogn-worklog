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
    backlog: { bg: "bg-gray-700", border: "border-gray-600", text: "text-gray-300" },
    todo: { bg: "bg-blue-900", border: "border-blue-700", text: "text-blue-300" },
    doing: { bg: "bg-orange-900", border: "border-orange-700", text: "text-orange-300" },
    done: { bg: "bg-gray-800", border: "border-gray-600", text: "text-gray-500" },
    archive: { bg: "bg-purple-900", border: "border-purple-700", text: "text-purple-300" },
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
    blue: { bg: "bg-blue-950/20", border: "border-blue-800/40", header: "bg-blue-900/50" },
    purple: { bg: "bg-purple-950/20", border: "border-purple-800/40", header: "bg-purple-900/50" },
    green: { bg: "bg-green-950/20", border: "border-green-800/40", header: "bg-green-900/50" },
    orange: { bg: "bg-orange-950/20", border: "border-orange-800/40", header: "bg-orange-900/50" },
    cyan: { bg: "bg-cyan-950/20", border: "border-cyan-800/40", header: "bg-cyan-900/50" },
    gray: { bg: "bg-gray-950/20", border: "border-gray-800/40", header: "bg-gray-900/50" },
    red: { bg: "bg-red-950/20", border: "border-red-800/40", header: "bg-red-900/50" },
    yellow: { bg: "bg-yellow-950/20", border: "border-yellow-800/40", header: "bg-yellow-900/50" },
    pink: { bg: "bg-pink-950/20", border: "border-pink-800/40", header: "bg-pink-900/50" },
    indigo: { bg: "bg-indigo-950/20", border: "border-indigo-800/40", header: "bg-indigo-900/50" },
};

export function MindMap({ tasks, relations, categories, onTaskClick, selectedTaskId }: MindMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [taskPositions, setTaskPositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());

    // ズームとパンのstate
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [lastPan, setLastPan] = useState({ x: 0, y: 0 });

    // カテゴリーの位置管理
    const [categoryPositions, setCategoryPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
    const [categoryDragStart, setCategoryDragStart] = useState({ x: 0, y: 0 });
    const [categoryDragOffset, setCategoryDragOffset] = useState({ x: 0, y: 0 });
    const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // タスクの位置を更新
    useEffect(() => {
        const updatePositions = () => {
            if (!containerRef.current || !contentRef.current) return;
            // ドラッグ中は位置更新をスキップ
            if (draggedCategory) return;

            const contentRect = contentRef.current.getBoundingClientRect();
            const newPositions = new Map<string, { x: number; y: number; width: number; height: number }>();

            taskRefs.current.forEach((element, taskId) => {
                const rect = element.getBoundingClientRect();
                // contentRef基準の座標に変換
                newPositions.set(taskId, {
                    x: (rect.left - contentRect.left) / zoom,
                    y: (rect.top - contentRect.top) / zoom,
                    width: rect.width / zoom,
                    height: rect.height / zoom,
                });
            });

            setTaskPositions(newPositions);
        };

        // requestAnimationFrameで次のフレームで更新
        const rafId = requestAnimationFrame(() => {
            const timeoutId = setTimeout(updatePositions, 50);
            return () => clearTimeout(timeoutId);
        });

        window.addEventListener('resize', updatePositions);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', updatePositions);
        };
    }, [tasks, categories, zoom, categoryPositions, draggedCategory]);

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

    // カテゴリーの初期位置を設定
    useEffect(() => {
        const newPositions = new Map<string, { x: number; y: number }>();
        activeCategories.forEach((cat, index) => {
            if (!categoryPositions.has(cat.id)) {
                const col = index % 3;
                const row = Math.floor(index / 3);
                newPositions.set(cat.id, {
                    x: col * 400,
                    y: row * 500,
                });
            } else {
                newPositions.set(cat.id, categoryPositions.get(cat.id)!);
            }
        });
        setCategoryPositions(newPositions);
    }, [activeCategories]);

    // カテゴリーのドラッグ開始
    const handleCategoryMouseDown = useCallback((e: React.MouseEvent, categoryId: string) => {
        // ヘッダー部分のみドラッグ可能
        const target = e.target as HTMLElement;
        if (!target.closest('[data-category-header]')) return;

        e.stopPropagation();
        setDraggedCategory(categoryId);
        const pos = categoryPositions.get(categoryId) || { x: 0, y: 0 };
        setCategoryDragStart({ x: e.clientX / zoom, y: e.clientY / zoom });
        setCategoryDragOffset({ x: pos.x, y: pos.y });
    }, [categoryPositions, zoom]);

    // カテゴリーのドラッグ中
    useEffect(() => {
        if (!draggedCategory) return;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX / zoom - categoryDragStart.x;
            const dy = e.clientY / zoom - categoryDragStart.y;

            setCategoryPositions(prev => {
                const newPos = new Map(prev);
                newPos.set(draggedCategory, {
                    x: categoryDragOffset.x + dx,
                    y: categoryDragOffset.y + dy,
                });
                return newPos;
            });
        };

        const handleMouseUp = () => {
            setDraggedCategory(null);
            // ドラッグ終了後に位置を更新
            requestAnimationFrame(() => {
                if (contentRef.current && containerRef.current) {
                    const contentRect = contentRef.current.getBoundingClientRect();
                    const newPositions = new Map<string, { x: number; y: number; width: number; height: number }>();

                    taskRefs.current.forEach((element, taskId) => {
                        const rect = element.getBoundingClientRect();
                        newPositions.set(taskId, {
                            x: (rect.left - contentRect.left) / zoom,
                            y: (rect.top - contentRect.top) / zoom,
                            width: rect.width / zoom,
                            height: rect.height / zoom,
                        });
                    });

                    setTaskPositions(newPositions);
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggedCategory, categoryDragStart, categoryDragOffset, zoom]);

    // 接続線の描画
    const renderConnections = useMemo(() => {
        if (taskPositions.size === 0) return null;

        return relations.map((rel) => {
            const fromPos = taskPositions.get(rel.fromTaskId);
            const toPos = taskPositions.get(rel.toTaskId);

            if (!fromPos || !toPos) return null;

            // 中心点を計算
            const fromCenterX = fromPos.x + fromPos.width / 2;
            const fromCenterY = fromPos.y + fromPos.height / 2;
            const toCenterX = toPos.x + toPos.width / 2;
            const toCenterY = toPos.y + toPos.height / 2;

            // 角度を計算してエッジの点を求める
            const dx = toCenterX - fromCenterX;
            const dy = toCenterY - fromCenterY;
            const angle = Math.atan2(dy, dx);

            // fromタスクのエッジ点
            const x1 = fromCenterX + (fromPos.width / 2) * Math.cos(angle);
            const y1 = fromCenterY + (fromPos.height / 2) * Math.sin(angle);

            // toタスクのエッジ点
            const x2 = toCenterX - (toPos.width / 2) * Math.cos(angle);
            const y2 = toCenterY - (toPos.height / 2) * Math.sin(angle);

            // ベジエ曲線のコントロールポイント
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

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

    // ズーム処理（Cmd/Ctrl + スクロール）
    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY;
            const zoomFactor = delta > 0 ? 0.9 : 1.1;
            setZoom(prev => Math.max(0.3, Math.min(3, prev * zoomFactor)));
        }
    }, []);

    // パン開始
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // タスク上でない場合のみパンを開始
        const target = e.target as HTMLElement;
        if (target.closest('[data-task-id]')) return;

        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
        setLastPan(pan);
    }, [pan]);

    // パン中
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning) return;

        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan({
            x: lastPan.x + dx,
            y: lastPan.y + dy,
        });
    }, [isPanning, panStart, lastPan]);

    // パン終了
    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    // ホイールイベントの登録
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-slate-900 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
            {/* SVG for connections */}
            <div
                ref={contentRef}
                className="absolute inset-0 p-6"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                }}
            >
                <svg
                    className="absolute pointer-events-none"
                    style={{
                        left: 0,
                        top: 0,
                        width: "3000px",
                        height: "3000px",
                        zIndex: 1,
                        overflow: 'visible'
                    }}
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

                <div className="relative" style={{ zIndex: 2, minWidth: '3000px', minHeight: '3000px' }}>
                    {activeCategories.map((category) => {
                        const categoryTasks = tasksByCategory[category.id] || [];
                        const colors = colorMapping[category.color] || colorMapping.gray;
                        const label = `${category.icon} ${category.name}`;
                        const position = categoryPositions.get(category.id) || { x: 0, y: 0 };
                        const isDragging = draggedCategory === category.id;

                        return (
                            <div
                                key={category.id}
                                ref={(el) => {
                                    if (el) categoryRefs.current.set(category.id, el);
                                    else categoryRefs.current.delete(category.id);
                                }}
                                className={`absolute rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden w-80 ${isDragging ? 'opacity-70 shadow-2xl' : ''}`}
                                style={{
                                    left: `${position.x}px`,
                                    top: `${position.y}px`,
                                    cursor: 'default',
                                }}
                                onMouseDown={(e) => handleCategoryMouseDown(e, category.id)}
                            >
                                {/* カテゴリーヘッダー */}
                                <div
                                    data-category-header
                                    className={`${colors.header} px-4 py-3 cursor-move select-none`}
                                >
                                    <h3 className="text-white font-bold text-lg pointer-events-none">
                                        {label}
                                        <span className="ml-2 text-white/70 text-sm font-normal">
                                            ({categoryTasks.length})
                                        </span>
                                    </h3>
                                </div>

                                {/* タスクリスト */}
                                <div className="p-6 space-y-5">
                                    {categoryTasks.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">
                                            タスクがありません
                                        </p>
                                    ) : (
                                        categoryTasks.map((task) => {
                                            const taskColors = statusColors[task.status] || statusColors.backlog;
                                            const isSelected = selectedTaskId === task.id;

                                            return (
                                                <div
                                                    key={task.id}
                                                    ref={(el) => setTaskRef(task.id, el)}
                                                    data-task-id={task.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onTaskClick(task.id);
                                                    }}
                                                    className={`
                                                    cursor-pointer transition-all duration-200 rounded-lg p-4 border-2
                                                    ${taskColors.bg} ${taskColors.border}
                                                    ${isSelected ? "ring-4 ring-cyan-400 scale-[1.02]" : "hover:scale-[1.01]"}
                                                `}
                                                >
                                                    <div className={`font-semibold text-sm truncate mb-2 ${task.status === 'done' ? 'text-gray-500' : 'text-white'}`}>
                                                        {task.name}
                                                    </div>
                                                    <div className={`text-xs ${taskColors.text} mb-2`}>
                                                        {statusLabels[task.status]}
                                                    </div>
                                                    <div className={`text-xs line-clamp-2 ${task.status === 'done' ? 'text-gray-600' : 'text-gray-400'}`}>
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
        </div>
    );
}
