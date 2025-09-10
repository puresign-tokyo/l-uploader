# 外部仕様

## フロントエンドから見える内容

### リプレイ投稿時ユーザ入力

- ユーザ名
  - 30 文字以下
- コメント
  - 300 文字以下
- パスワード
  - 100 文字以下
- リプレイファイル
  - 200KB 以下
- オプションタグ
  - 英数字のみ、20 文字以下
- reCAPTCHA トークン
  - サーバ設定により必須（エンドポイントは常に受け付け）

## HTTP リクエスト内容

### `GET /replays`

- 概要: リプレイのメタデータ一覧を返す
- リクエスト
  - ```
    GET /replays?
    game_id={game_id}&
    category={category}&
    optional_tag={optional_tag}&
    order={order}&
    page={page}
    ```
  - `game_id`: `all`(デフォルト) または対応作品 ID
  - `category`: `all`(デフォルト) | `score_run` | `no_bomb` | `no_miss` | `clear` | `others`
  - `optional_tag`: 任意。英数字のみ。
  - `order`: `asc`(デフォルト) | `desc`
  - `page`: 0 始まりのページ番号。`-1` で最大ページ分をまとめて取得（上限あり）
- 応答
  - `JSON`: `JSONリプレイメタデータ` の配列
  - エラー
    - 400: パラメータ不正（例: 未対応 `game_id`、不正な `page`）
    - 500: サーバ内部エラー

### `GET /replays/count`

- 概要: 条件に合致するリプレイ件数を返す
- リクエスト
  - ```
    GET /replays/count?
    game_id={game_id}&
    category={category}&
    optional_tag={optional_tag}&
    uploaded_date_since={ISO-8601}&
    uploaded_date_until={ISO-8601}
    ```
  - `game_id`: `all`(デフォルト) または対応作品 ID
  - `category`: `all`(デフォルト) | `score_run` | `no_bomb` | `no_miss` | `clear` | `others`
  - `optional_tag`: 任意。英数字のみ、20 文字以下
  - `uploaded_date_since`: 既定は `1970-01-01T00:00:00+09:00`（Asia/Tokyo）
  - `uploaded_date_until`: 既定は現在時刻（Asia/Tokyo）
- 応答
  - `JSON`: `{ "count": number }`
  - エラー
    - 400: パラメータ不正（例: 未対応 `game_id`）
    - 500: サーバ内部エラー

### `GET /replays/{replay_id}`

- ```
  GET /replays/{replay_id}
  ```
- 1 個のリプレイファイルのメタデータを返す
- 応答
  - `JSON`: 対応する `JSONリプレイメタデータ`
  - エラー
    - 404: 指定 ID のリプレイなし
    - 400: 不正リクエスト

### `GET /replays/{replay_id}/file`

- ```
  GET /replays/{replay_id}/file
  ```
- リプレイファイルを返す
- 応答
  - ファイル応答（`filename` は `{game_id}_ud{replay_id変換}.rpy`）
  - エラー
    - 404: ファイルまたはレコードが存在しない

### `POST /replays`

- ```
  POST /replays
  ```
- リクエストボディ
  - user_name (form)
    - ユーザネーム
    - 30 文字以下
  - category (form)
    - `score_run` | `no_bomb` | `no_miss` | `clear` | `others`
  - optional_tag (form)
    - 英数字のみ、1 つだけ可
  - upload_comment (form)
    - 300 文字以下
  - delete_password (form)
    - 100 文字以下、可読文字の US-ASCII 互換のみ、空白のみは不可
  - replay_file (file)
    - 200KB 以下
  - recaptcha_token (form)
    - reCAPTCHA 検証用トークン
- 応答
  - 成功: `200 OK`, `JSON`: `{ "replay_id": number }`
  - 競合: `409 Conflict`, `JSON`: `{ "replay_id": number }`（重複投稿）
    - オプションで Conflict しないように設定可
  - 認証失敗: `401 Unauthorized`（reCAPTCHA 失敗）
  - レート制限: `429 Too Many Requests`
  - 入力不正: `400 Bad Request`（長さ超過、ファイルサイズ超過 等）

### `DELETE /replays/{replay_id}`

- ```
  DELETE /replays/{replay_id}
  ```
- リクエストボディ
  - delete_password (json)
    - 100 文字以下
  - recaptcha_token (json)
    - reCAPTCHA 検証用トークン
- 応答
  - 成功: `200 OK`（空レスポンス）
  - 404: リプレイが存在しない
  - 403: パスワード不一致
  - 401: reCAPTCHA 失敗
  - 429: レート制限

### `DELETE /internal/replays/{replay_id}`

- ```
  DELETE /internal/replays/{replay_id}
  ```
- 削除パスワード無しでリプレイ削除できる
- 応答
  - `200 OK`（空レスポンス）

### `DELETE /internal/replays`

- ```
  DELETE /internal/replays?uploaded_until={ISO-8601}
  ```
- 指定日時（既定: 現在-365 日, Asia/Tokyo）以前の投稿を一括削除
- 応答: `200 OK`（空レスポンス）

### `DELETE /internal/cache/ratelimit_ip`

- ```
  DELETE /internal/cache/ratelimit_ip?ip_addr={IPv4/IPv6}
  ```
- 指定 IP のレート制限カウンタを削除
- 応答: `200 OK`（空レスポンス）

### `POST /internal/integrity_sync`

- ```
  POST /internal/integrity_sync
  ```
- 内部整合性チェック・同期を実行
- 応答: `200 OK`（空レスポンス）

### `GET /alcohol`

- ```
  GET /alcohol
  ```
- `/teapot` にリダイレクトし、結果的に `418 I'm a teapot` を返す
- `cocktail` `wine` `sake` `beer` も同様に `/teapot` へリダイレクト

### `GET /teapot`

- `418 I'm a teapot` を返す
- `detail`: `I can't serve you alcohol, because I am a little teapot. But I can pour you some Returner Liqueur instead.`

### `GET /returner`

- `200 OK` を返す
- `JSON`: `{ "name": "Returner Liqueur", "type": "tea liqueur", "abv": "24%", "note": "..." }`

## JSON リプレイメタデータ

- `game_id` と `stage_details` というキーを含んでいる JSON データ
  - `game_id` は `thXX` 等から始まるゲーム識別子
  - `stage_details` は各面の詳細データが辞書形式で詰まった配列
    - スペルカードのリプレイや、小数作品でそもそも面の概念がない場合は空のリストが入る
    - 通しプレイであっても最終面はスコアやステージ以外のメタデータが存在しない。その場合は存在しない項目について `null` で返す
    - 各作品毎に任意のキーが入るのでクライアント側で良しなに解釈する
- `game_id` と `stage_details` 以外は各作品によって入るキーが異なる。
  - クライアント側で良しなに解釈する
