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

// 初期タスクデータ
export const initialTasks: TaskData[] = [
  {
    id: "task-001",
    name: "プロジェクト計画",
    createdAt: "2025-12-20",
    updatedAt: "2025-12-25",
    isComplete: false,
    status: "doing",
    description: "プロジェクト全体の計画を立てる",
    summary: "",
  },
  {
    id: "task-002",
    name: "要件定義",
    createdAt: "2025-12-21",
    updatedAt: "2025-12-24",
    isComplete: false,
    status: "todo",
    description: "システム要件の定義と整理",
    summary: "",
  },
  {
    id: "task-003",
    name: "UI設計",
    createdAt: "2025-12-22",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "ユーザーインターフェースの設計",
    summary: "",
  },
  {
    id: "task-004",
    name: "データベース設計",
    createdAt: "2025-12-22",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "データベーススキーマの設計",
    summary: "",
  },
  {
    id: "task-005",
    name: "API実装",
    createdAt: "2025-12-23",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "バックエンドAPIの実装",
    summary: "",
  },
  {
    id: "task-006",
    name: "フロントエンド実装",
    createdAt: "2025-12-23",
    updatedAt: "2025-12-23",
    isComplete: false,
    status: "backlog",
    description: "フロントエンドの実装",
    summary: "",
  },
  {
    id: "task-007",
    name: "テスト",
    createdAt: "2025-12-24",
    updatedAt: "2025-12-24",
    isComplete: false,
    status: "backlog",
    description: "ユニットテストと結合テストの作成",
    summary: "",
  },
  {
    id: "task-008",
    name: "ドキュメント作成",
    createdAt: "2025-12-25",
    updatedAt: "2025-12-25",
    isComplete: true,
    status: "done",
    description: "プロジェクトドキュメントの作成",
    summary: "基本ドキュメントを完成させました",
  },
];

// タスク関連データ
export const initialTaskRelations: TaskRelationData[] = [
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
  {
    id: "rel-003",
    fromTaskId: "task-002",
    toTaskId: "task-004",
    type: "depends_on",
  },
  {
    id: "rel-004",
    fromTaskId: "task-003",
    toTaskId: "task-006",
    type: "depends_on",
  },
  {
    id: "rel-005",
    fromTaskId: "task-004",
    toTaskId: "task-005",
    type: "depends_on",
  },
  {
    id: "rel-006",
    fromTaskId: "task-005",
    toTaskId: "task-006",
    type: "related",
  },
  {
    id: "rel-007",
    fromTaskId: "task-006",
    toTaskId: "task-007",
    type: "depends_on",
  },
  {
    id: "rel-008",
    fromTaskId: "task-007",
    toTaskId: "task-008",
    type: "related",
  },
];

// 作業メモデータ
export const initialWorkNotes: WorkNoteData[] = [
  {
    id: "note-001",
    taskId: "task-001",
    date: "2025-12-25",
    note: "プロジェクトのスコープを確定し、マイルストーンを設定しました。関係者との合意も取得済み。",
  },
  {
    id: "note-002",
    taskId: "task-001",
    date: "2025-12-24",
    note: "プロジェクト計画の初期ドラフトを作成しました。リソース配分の検討を開始。",
  },
  {
    id: "note-003",
    taskId: "task-002",
    date: "2025-12-24",
    note: "要件のヒアリングを実施。主要な機能要件を整理しました。",
  },
  {
    id: "note-004",
    taskId: "task-008",
    date: "2025-12-25",
    note: "README.mdとAPI仕様書の作成を完了しました。",
  },
  {
    id: "note-005",
    taskId: "task-001",
    date: "2025-12-26",
    note: "週次ミーティングで進捗報告を実施。スケジュールの微調整を行いました。",
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
