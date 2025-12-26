/**
 * モックデータ - 初期データとしてメモリに保持
 */

export interface TaskData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
  status: string;
  description: string;
  summary: string;
  category: string;
}

export interface TaskRelationData {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  type: string;
}

export interface WorkNoteData {
  id: string;
  taskId: string;
  date: string;
  note: string;
}

export interface DailyReportData {
  id: string;
  date: string;
  summary: string;
  createdAt: string;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 初期タスクデータ
export const initialTasks: TaskData[] = [
  // 学習カテゴリー
  {
    id: "task-001",
    name: "TypeScript基礎学習",
    createdAt: "2025-12-20",
    updatedAt: "2025-12-25",
    isComplete: false,
    status: "doing",
    description: "TypeScriptの型システムとジェネリクスを習得する",
    summary: "",
    category: "cat-learning",
  },
  {
    id: "task-002",
    name: "React Hooks マスター",
    createdAt: "2025-12-21",
    updatedAt: "2025-12-24",
    isComplete: false,
    status: "todo",
    description: "useEffect, useMemo, useCallbackなどのフックを理解する",
    summary: "",
    category: "cat-learning",
  },
  {
    id: "task-003",
    name: "TanStack Router 学習",
    createdAt: "2025-12-22",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "TanStack Routerの基本的な使い方を学ぶ",
    summary: "",
    category: "cat-learning",
  },
  // キャリアカテゴリー
  {
    id: "task-004",
    name: "ポートフォリオ更新",
    createdAt: "2025-12-22",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "todo",
    description: "最新のプロジェクトをポートフォリオに追加する",
    summary: "",
    category: "cat-career",
  },
  {
    id: "task-005",
    name: "技術ブログ執筆",
    createdAt: "2025-12-23",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "学んだ技術についてブログ記事を書く",
    summary: "",
    category: "cat-career",
  },
  {
    id: "task-006",
    name: "LinkedIn プロフィール更新",
    createdAt: "2025-12-23",
    updatedAt: "2025-12-23",
    isComplete: true,
    status: "done",
    description: "スキルと経験を最新化する",
    summary: "プロフィールを更新しました",
    category: "cat-career",
  },
  // 自己サービスカテゴリー
  {
    id: "task-007",
    name: "個人アプリ開発",
    createdAt: "2025-12-24",
    updatedAt: "2025-12-24",
    isComplete: false,
    status: "doing",
    description: "タスク管理アプリのプロトタイプを作成する",
    summary: "",
    category: "cat-self-service",
  },
  {
    id: "task-008",
    name: "クラウド環境構築",
    createdAt: "2025-12-25",
    updatedAt: "2025-12-25",
    isComplete: false,
    status: "backlog",
    description: "個人開発用のクラウド環境をセットアップする",
    summary: "",
    category: "cat-self-service",
  },
  // 家庭カテゴリー
  {
    id: "task-009",
    name: "年末大掃除",
    createdAt: "2025-12-24",
    updatedAt: "2025-12-26",
    isComplete: false,
    status: "todo",
    description: "年末に向けて家の大掃除を行う",
    summary: "",
    category: "cat-home",
  },
  {
    id: "task-010",
    name: "家計簿整理",
    createdAt: "2025-12-25",
    updatedAt: "2025-12-25",
    isComplete: true,
    status: "done",
    description: "今月の収支を整理してまとめる",
    summary: "12月の家計簿を完成させました",
    category: "cat-home",
  },
];

// タスク関連データ
export const initialTaskRelations: TaskRelationData[] = [
  // 学習の依存関係
  {
    id: "rel-001",
    fromTaskId: "task-001",
    toTaskId: "task-002",
    type: "depends_on",
  },
  {
    id: "rel-002",
    fromTaskId: "task-002",
    toTaskId: "task-003",
    type: "depends_on",
  },
  // 学習とキャリアの関連
  {
    id: "rel-003",
    fromTaskId: "task-001",
    toTaskId: "task-005",
    type: "related",
  },
  // キャリア内の依存関係
  {
    id: "rel-004",
    fromTaskId: "task-004",
    toTaskId: "task-006",
    type: "related",
  },
  // 学習と自己サービスの依存関係
  {
    id: "rel-005",
    fromTaskId: "task-003",
    toTaskId: "task-007",
    type: "depends_on",
  },
  // 自己サービス内の依存関係
  {
    id: "rel-006",
    fromTaskId: "task-007",
    toTaskId: "task-008",
    type: "depends_on",
  },
  // 家庭の関連
  {
    id: "rel-007",
    fromTaskId: "task-009",
    toTaskId: "task-010",
    type: "related",
  },
];

// 作業メモデータ
export const initialWorkNotes: WorkNoteData[] = [
  {
    id: "note-001",
    taskId: "task-001",
    date: "2025-12-25",
    note: "TypeScriptのジェネリクスについて公式ドキュメントを読んで理解を深めた。",
  },
  {
    id: "note-002",
    taskId: "task-001",
    date: "2025-12-24",
    note: "型推論とユーティリティ型について学習開始。Partial, Required, Pickなど。",
  },
  {
    id: "note-003",
    taskId: "task-007",
    date: "2025-12-24",
    note: "タスク管理アプリの基本構造を設計。TanStack Startを使用することに決定。",
  },
  {
    id: "note-004",
    taskId: "task-010",
    date: "2025-12-25",
    note: "12月の収支をまとめ、来月の予算計画を立てました。",
  },
  {
    id: "note-005",
    taskId: "task-007",
    date: "2025-12-26",
    note: "MindMapコンポーネントを実装。タスクの関係性を可視化できるようになった。",
  },
];

// 日報データ
export const initialDailyReports: DailyReportData[] = [
  {
    id: "report-001",
    date: "2025-12-24",
    summary:
      "本日の作業内容:\n\n1. プロジェクト計画の初期ドラフトを作成しました。リソース配分の検討を開始。\n2. 要件のヒアリングを実施。主要な機能要件を整理しました。\n\n進捗: 順調に進んでいます。",
    createdAt: "2025-12-24",
  },
  {
    id: "report-002",
    date: "2025-12-25",
    summary:
      "本日の作業内容:\n\n1. プロジェクトのスコープを確定し、マイルストーンを設定しました。関係者との合意も取得済み。\n2. README.mdとAPI仕様書の作成を完了しました。\n\n進捗: ドキュメント作成タスクを完了。",
    createdAt: "2025-12-25",
  },
];

// カテゴリーデータ
export const initialCategories: CategoryData[] = [
  {
    id: "cat-learning",
    name: "学習",
    icon: "📚",
    color: "blue",
    order: 1,
    createdAt: "2025-12-20",
    updatedAt: "2025-12-20",
  },
  {
    id: "cat-career",
    name: "キャリア",
    icon: "💼",
    color: "purple",
    order: 2,
    createdAt: "2025-12-20",
    updatedAt: "2025-12-20",
  },
  {
    id: "cat-self-service",
    name: "自己サービス",
    icon: "🚀",
    color: "green",
    order: 3,
    createdAt: "2025-12-20",
    updatedAt: "2025-12-20",
  },
  {
    id: "cat-home",
    name: "家庭",
    icon: "🏠",
    color: "orange",
    order: 4,
    createdAt: "2025-12-20",
    updatedAt: "2025-12-20",
  },
];
