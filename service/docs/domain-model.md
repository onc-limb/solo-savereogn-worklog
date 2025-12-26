# ドメインモデル定義

## ドメインモデルとは
本アプリケーションにおける重要なデータと処理をまとめたオブジェクトである。
ドメインモデルには下記の種類がある。
- Entity: IDによって一意に定まるライフサイクルを持つオブジェクト
- ValueObject: 値によって一意に定まるオブジェクト

それぞれのオブジェクトが、自身が存在するための定義やルールをバリデーションメソッドとして保持している。

## 本アプリケーションのドメインモデル
### タスク集約
一つのタスクを表現する集約
タスクEntityを集約のルートとする
#### タスクEntity
data
- id: TaskId　タスクを一意に表す識別子
- name: Name　タスクの名前
- createdAt: DateOnly タスクの作成日
- updatedAt: DateOnly タスクの最終更新日
- isComplete: boolean 完了しているか否かのフラグ
- status: TaskStatus タスクの進捗ステータス
- description: FreeText タスクの説明
- summary: FreeText タスクに紐づく作業メモの要約

method
- create: 新規でタスクEntityを作成するメソッド
- reconstruct: 更新のために既存のデータを取得してタスクEntityを作成するメソッド
- updateStatus: タスクの更新を行うメソッド
  - タスクの更新ルールとして、Doneステータスに更新するときは、isCompleteをtrueにする。
- complete: タスクを完了にするメソッド
  - タスクを完了にするとき、タスクのステータスはDoneにする
- updateName: タスクの名前を更新するメソッド
- updateDescription: タスクの説明を更新する
- createSummary: タスクに紐づく作業メモを要約するメソッド
  - タスクがDoneになった時に実行する

### タスク関連集約
タスク間の関係を表現する集約
タスク関連Entityを集約のルートとする
#### タスクEntity
data
- id: TaskRelationId　タスク関連を一意に表す識別子
- fromTaskId: TaskId 関係元のタスク
- toTaskId: TaskId 関係先のタスク
- type:　TaskRelationType depens_on, relatedの二種類の関係を示す
  - depens_on: fromが終わらないとtoができない
  - related: 単純に関連している

method
- create: 新規でタスクEntityを作成するメソッド
- reconstruct: 更新のために既存のデータを取得してタスクEntityを作成するメソッド
- updateStatus: タスクの更新を行うメソッド
  - タスクの更新ルールとして、Doneステータスに更新するときは、isCompleteをtrueにする。
- complete: タスクを完了にするメソッド
  - タスクを完了にするとき、タスクのステータスはDoneにする
- updateName: タスクの名前を更新するメソッド
- updateDescription: タスクの説明を更新する
- createSummary: タスクに紐づく作業メモを要約するメソッド
  - タスクがDoneになった時に実行する

### 作業メモ集約
特定のタスクの、特定の日の作業メモを表現する集約
作業メモEntityを集約のルートとする
#### 作業メモEntity
data
- id: WorkNoteId　作業メモを一意に表す識別子
- date: DateOnly 作業メモの対象日
- note: FreeText 作業メモの内容

method
- create: 新規で作業メモEntityを作成するメソッド
- reconstruct: 更新のために既存のデータを取得して作業メモEntityを作成するメソッド
- updateNote: 作業メモの更新を行うメソッド

### 日報集約
特定の日の作業メモを要約して日報とする集約
日報Entityを集約のルートとする
※現状、作業メモから該当日のデータを取得してLLMに要約させるだけのため、集約の必要性がない。
#### 日報Entity

### ValueObject
- xxId: Idを継承して実装するUUID
- Name: 1文字以上で100文字以下の文字列
- DateOnly: YYYY-MM-DDで日付までを持つ型。JSTで計算する
- FreeText: 0文字以上1000000文字以下の文字列
- TaskStatus: backlog, todo, doing, done, archiveの五つのステータスを持つ
- TaskRelationType: depens_on, relationsの二つの状態を持つ