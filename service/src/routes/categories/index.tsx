import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Plus, Trash2, Save, GripVertical, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../server/functions";

export const Route = createFileRoute("/categories/" as any)({
    component: CategoriesPage,
    loader: async () => {
        const categories = await getCategories();
        return { categories };
    },
});

const colorOptions = [
    { value: "blue", label: "青", class: "bg-blue-600" },
    { value: "purple", label: "紫", class: "bg-purple-600" },
    { value: "green", label: "緑", class: "bg-green-600" },
    { value: "orange", label: "オレンジ", class: "bg-orange-600" },
    { value: "cyan", label: "シアン", class: "bg-cyan-600" },
    { value: "gray", label: "グレー", class: "bg-gray-600" },
    { value: "red", label: "赤", class: "bg-red-600" },
    { value: "yellow", label: "黄", class: "bg-yellow-600" },
    { value: "pink", label: "ピンク", class: "bg-pink-600" },
    { value: "indigo", label: "インディゴ", class: "bg-indigo-600" },
];

const iconOptions = ["📁", "📋", "🎨", "💻", "🧪", "📝", "📦", "🔧", "🚀", "⚙️", "📊", "🎯", "💡", "🔒", "🌟"];

function CategoriesPage() {
    const { categories: initialCategories } = Route.useLoaderData();
    const [categories, setCategories] = useState(initialCategories);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIcon, setNewIcon] = useState("📁");
    const [newColor, setNewColor] = useState("gray");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editIcon, setEditIcon] = useState("");
    const [editColor, setEditColor] = useState("");

    const handleRefresh = useCallback(async () => {
        const newCategories = await getCategories();
        setCategories(newCategories);
    }, []);

    const handleAddCategory = useCallback(async () => {
        if (!newName.trim()) return;
        const maxOrder = Math.max(...categories.map((c: any) => c.order), 0);
        await createCategory({
            data: { name: newName, icon: newIcon, color: newColor, order: maxOrder + 1 },
        });
        setNewName("");
        setNewIcon("📁");
        setNewColor("gray");
        setIsAdding(false);
        await handleRefresh();
    }, [newName, newIcon, newColor, categories, handleRefresh]);

    const handleEditCategory = useCallback(
        async (id: string) => {
            if (!editName.trim()) return;
            await updateCategory({
                data: { id, name: editName, icon: editIcon, color: editColor },
            });
            setEditingId(null);
            await handleRefresh();
        },
        [editName, editIcon, editColor, handleRefresh]
    );

    const handleDeleteCategory = useCallback(
        async (id: string) => {
            if (!confirm("このカテゴリーを削除しますか？")) return;
            await deleteCategory({ data: id });
            await handleRefresh();
        },
        [handleRefresh]
    );

    const startEdit = useCallback((cat: any) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditIcon(cat.icon);
        setEditColor(cat.color);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">カテゴリー管理</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            更新
                        </button>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            カテゴリー追加
                        </button>
                    </div>
                </div>

                {/* Add new category form */}
                {isAdding && (
                    <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-cyan-500">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            新しいカテゴリー
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    名前
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    placeholder="カテゴリー名"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    アイコン
                                </label>
                                <select
                                    value={newIcon}
                                    onChange={(e) => setNewIcon(e.target.value)}
                                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    {iconOptions.map((icon) => (
                                        <option key={icon} value={icon}>
                                            {icon}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    色
                                </label>
                                <select
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    {colorOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewName("");
                                }}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleAddCategory}
                                disabled={!newName.trim()}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                追加
                            </button>
                        </div>
                    </div>
                )}

                {/* Categories list */}
                <div className="space-y-3">
                    {categories.map((cat: any) => {
                        const colorClass =
                            colorOptions.find((c) => c.value === cat.color)?.class ||
                            "bg-gray-600";

                        if (editingId === cat.id) {
                            return (
                                <div
                                    key={cat.id}
                                    className="bg-slate-800 rounded-xl p-4 border border-cyan-500"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                名前
                                            </label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                アイコン
                                            </label>
                                            <select
                                                value={editIcon}
                                                onChange={(e) => setEditIcon(e.target.value)}
                                                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            >
                                                {iconOptions.map((icon) => (
                                                    <option key={icon} value={icon}>
                                                        {icon}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                色
                                            </label>
                                            <select
                                                value={editColor}
                                                onChange={(e) => setEditColor(e.target.value)}
                                                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                            >
                                                {colorOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                                            >
                                                キャンセル
                                            </button>
                                            <button
                                                onClick={() => handleEditCategory(cat.id)}
                                                className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Save className="w-4 h-4" />
                                                保存
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={cat.id}
                                className="bg-slate-800 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-750 transition-colors"
                            >
                                <div className="text-gray-500 cursor-grab">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center text-xl`}>
                                    {cat.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold">{cat.name}</div>
                                    <div className="text-gray-500 text-sm">ID: {cat.id}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(cat)}
                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">カテゴリーがありません</p>
                    </div>
                )}
            </div>
        </div>
    );
}
