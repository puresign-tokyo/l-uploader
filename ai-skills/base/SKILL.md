---
name: l-uploader-base
description: l-uploader の devcontainer 内作業向けガイダンス。フロントエンド実装、devcontainer 設定、依存関係、parser 生成、安全確認が必要な変更で使う。
---

# l-uploader 基本ワークフロー

## 使う場面

この skill は、フロントエンド実装、devcontainer 設定、依存関係のセットアップ、生成 parser、ローカル環境に依存する保守作業を行うときに使う。

## 作業ルール

- ファイル削除、volume 削除、Git 状態のリセット、履歴の書き換えなどの破壊的操作は、必ず事前にユーザへ確認する。
- プロジェクトツールに依存するコマンドは、できるだけ devcontainer 環境で実行する。
- ユーザ固有の状態は `/home/vscode`、プロジェクトの状態は `/workspace/l-uploader` に置く。
- devcontainer 外でも skill を有効にしたい場合を除き、Codex skill を repo root の `.agents/skills` に移動しない。
- 生成物や依存 cache は、リポジトリが明示的に管理していない限り Git に含めない。

## フロントエンドのフォーマット

- フロントエンドのコード（Vue、TypeScript、JavaScript、テストを含む）を作成・変更したら、完了前に変更ファイルへ Prettier を実行する。
- 既存の Prettier 設定と実行スクリプトを優先し、対象は変更ファイルに絞る。プロジェクト全体を無関係に再整形しない。
- 実行スクリプトがない場合は、`frontend/app` で `corepack pnpm exec prettier --write <変更ファイル...>` を使う。
- Prettier が利用できない、または実行制限でフォーマットできない場合は、未実行であることと理由を報告する。手作業の整形だけで Prettier 実行済みとはしない。

## 進め方

1. 変更前に、関連する `.devcontainer`、backend、frontend、parser 周辺のファイルを確認する。
2. 既存の構成を保ちながら、必要最小限の変更を行う。
3. 可能であれば、設定構文の確認や最小限の動作確認を行う。
4. 変更内容、確認したこと、必要な rebuild / recreate 手順を簡潔にまとめる。
