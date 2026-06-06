# AGENTS.md

## プロジェクト方針

- 依存関係、生成 parser、開発ツール設定を変更するときは、基本的に devcontainer を使う。
- 変更はユーザーの依頼範囲に絞り、既存の構成やディレクトリ設計を優先する。
- ファイル削除、volume 削除、Git 履歴の書き換え、worktree のリセットなどの破壊的操作は、必ずユーザーが明示的に承認してから行う。
- `.pnpm-store`、`node_modules`、build 出力、ツール cache などは、プロジェクトが明示的に管理していない限り Git に追加しない。
- 検索にはできるだけ `rg` を使い、編集前に関連する周辺コードや設定を読む。

## devcontainer

- ユーザー状態は `/home/vscode`、プロジェクト本体は `/workspace/l-uploader` に分ける。
- Codex、VS Code Server、GPG、package cache は用途ごとに分けて管理する。
- devcontainer 内だけで有効にしたい Codex skill は `ai-skills/` に置き、Docker Compose で `/home/vscode/.agents/skills` に mount する。

## 確認

- 変更後は、現実的な範囲で最小の確認コマンドを実行する。
- 確認できなかった場合は、何を確認できなかったのかと理由を明記する。
