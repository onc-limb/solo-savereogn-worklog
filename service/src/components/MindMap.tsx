import { useState, useCallback, useRef, useEffect } from "react";

interface TaskNode {
    id: string;
    name: string;
    status: string;
    description: string;
    x: number;
    y: number;
}

interface TaskRelation {
    id: string;
    fromTaskId: string;
    toTaskId: string;
    type: string;
}

interface MindMapProps {
    tasks: {
        id: string;
        name: string;
        status: string;
        description: string;
    }[];
    relations: TaskRelation[];
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

export function MindMap({ tasks, relations, onTaskClick, selectedTaskId }: MindMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<TaskNode[]>([]);
    const [dragging, setDragging] = useState<string | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // タスクの位置を計算（ツリーレイアウト）
    useEffect(() => {
        if (tasks.length === 0) return;

        // ルートノードを見つける（他のノードから参照されていないノード）
        const toTaskIds = new Set(relations.map((r) => r.toTaskId));
        const rootTasks = tasks.filter((t) => !toTaskIds.has(t.id));

        // 幅優先探索でレイアウト
        const positioned: TaskNode[] = [];
        const visited = new Set<string>();
        const levelNodes: Map<number, string[]> = new Map();

        const queue: { id: string; level: number }[] = [];
        rootTasks.forEach((t) => queue.push({ id: t.id, level: 0 }));

        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            if (visited.has(id)) continue;
            visited.add(id);

            if (!levelNodes.has(level)) {
                levelNodes.set(level, []);
            }
            levelNodes.get(level)!.push(id);

            // 子ノードを追加
            const children = relations
                .filter((r) => r.fromTaskId === id)
                .map((r) => r.toTaskId);
            children.forEach((childId) => {
                if (!visited.has(childId)) {
                    queue.push({ id: childId, level: level + 1 });
                }
            });
        }

        // 訪問されなかったノードも追加
        tasks.forEach((t) => {
            if (!visited.has(t.id)) {
                const maxLevel = Math.max(...Array.from(levelNodes.keys()), -1);
                const level = maxLevel + 1;
                if (!levelNodes.has(level)) {
                    levelNodes.set(level, []);
                }
                levelNodes.get(level)!.push(t.id);
            }
        });

        // 位置を計算
        const nodeWidth = 180;
        const nodeHeight = 120;
        const horizontalGap = 60;
        const verticalGap = 40;

        levelNodes.forEach((nodeIds, level) => {
            const totalWidth = nodeIds.length * nodeWidth + (nodeIds.length - 1) * horizontalGap;
            const startX = (800 - totalWidth) / 2;

            nodeIds.forEach((nodeId, index) => {
                const task = tasks.find((t) => t.id === nodeId);
                if (task) {
                    positioned.push({
                        ...task,
                        x: startX + index * (nodeWidth + horizontalGap),
                        y: 50 + level * (nodeHeight + verticalGap),
                    });
                }
            });
        });

        setNodes(positioned);
    }, [tasks, relations]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, nodeId: string) => {
            e.preventDefault();
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
                setDragging(nodeId);
                setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
            }
        },
        [nodes]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!dragging) return;
            setNodes((prev) =>
                prev.map((n) =>
                    n.id === dragging
                        ? { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y }
                        : n
                )
            );
        },
        [dragging, offset]
    );

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    // 接続線を描画
    const renderConnections = () => {
        return relations.map((rel) => {
            const fromNode = nodes.find((n) => n.id === rel.fromTaskId);
            const toNode = nodes.find((n) => n.id === rel.toTaskId);
            if (!fromNode || !toNode) return null;

            const nodeWidth = 180;
            const nodeHeight = 80;

            const x1 = fromNode.x + nodeWidth / 2;
            const y1 = fromNode.y + nodeHeight;
            const x2 = toNode.x + nodeWidth / 2;
            const y2 = toNode.y;

            const midY = (y1 + y2) / 2;
            const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

            return (
                <g key={rel.id}>
                    <path
                        d={path}
                        fill="none"
                        stroke={rel.type === "depends_on" ? "#60a5fa" : "#a78bfa"}
                        strokeWidth="2"
                        strokeDasharray={rel.type === "related" ? "5,5" : "none"}
                        markerEnd="url(#arrowhead)"
                    />
                </g>
            );
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-slate-900 overflow-auto"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "1000px", minHeight: "800px" }}>
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                    </marker>
                </defs>
                {renderConnections()}
            </svg>

            {/* Task nodes */}
            {nodes.map((node) => {
                const colors = statusColors[node.status] || statusColors.backlog;
                const isSelected = selectedTaskId === node.id;

                return (
                    <div
                        key={node.id}
                        className={`absolute cursor-pointer transition-all duration-200 rounded-lg p-4 border-2 ${colors.bg
                            } ${colors.border} ${isSelected ? "ring-4 ring-cyan-400 scale-105" : "hover:scale-102"
                            }`}
                        style={{
                            left: node.x,
                            top: node.y,
                            width: 180,
                            minHeight: 80,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                        onClick={(e) => {
                            if (!dragging) {
                                e.stopPropagation();
                                onTaskClick(node.id);
                            }
                        }}
                    >
                        <div className="text-white font-semibold text-sm truncate mb-2">
                            {node.name}
                        </div>
                        <div className={`text-xs ${colors.text} mb-2`}>
                            {statusLabels[node.status]}
                        </div>
                        <div className="text-gray-400 text-xs line-clamp-2">
                            {node.description || "説明なし"}
                        </div>
                    </div>
                );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-800/90 rounded-lg p-4">
                <div className="text-white text-sm font-semibold mb-2">凡例</div>
                <div className="flex flex-wrap gap-2">
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
                <div className="mt-2 flex gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-0.5 bg-blue-400" />
                        <span className="text-gray-300 text-xs">依存</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-0.5 bg-purple-400" style={{ backgroundImage: "repeating-linear-gradient(90deg, #a78bfa 0, #a78bfa 5px, transparent 5px, transparent 10px)" }} />
                        <span className="text-gray-300 text-xs">関連</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
