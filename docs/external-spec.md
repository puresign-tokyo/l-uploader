# 外部仕様

## フロントエンドから見える内容

### リプレイ投稿時ユーザ入力

* ユーザ名
  * 30文字以下
* コメント
  * 300文字以下
* パスワード
  * 100文字以下
* リプレイファイル
  * 200KB以下

## HTTPリクエスト内容

### `GET /replays`

- ```
  GET /replays?
  sort={sort_kind}&
  order={order_kind}&
  uploaded_date_since={uploaded_date_since}&
  uploaded_date_until={uploaded_date_until}&
  created_date_since={created_date_since}&
  created_date_until={created_date_until}&
  offset={offset_num}&
  limit={limit_num}&
  <!-- game_id={game_id}& -->
  mode={mode}&
  shot_type={shot_type}&
  category={category}&
  optional_tag={optional_tag}
  ```
- `sort_kind`
  - `uploaded_at` (デフォルト)
  - `created_at`
- `order_kind`
  - `asc` (デフォルト)
  - `desc`
- `[created | uploaded]_date_[since | until]`
  - 日付指定
  - 以上、以下を使用する
- `offset`
  - 0始まり開始数値
- `limit`
  - 50以下
- `game_id`
  - `all` (デフォルト)
  - `thXX`
  - 黄昏酒場対応後 `alco` も入れる予定
- `mode`
  - `all` (デフォルト)
  - `full_game`
  - `stage_practice`
  - `spell_practice`
  - `player_vs_player`
- `shot_type`
  - `all`
  - 各作品のキャラ等
  - 対応していないキャラはエラーを返したい(願望)
- `category`
  - `all`
  - `score_run`
  - `clear`
  - `no_bomb`
  - `no_miss`
  - `other`
- `optional_tag`
  - 英数字のみ、1つだけ設定可
- 応答
  - `JSON`
    - 当てはまるリプレイについて `JSONリプレイメタデータ` の配列が返る

### `GET /replays/count`

- ```
  GET /replays/count?
  uploaded_after={upload_after}&
  uploaded_before={end_time}&
  created_after={created_after}&
  created_before={created_before}&
  offset={offset_num}&
  limit={limit_num}&
  game_id={game_id}&
  mode={mode}&
  shot_type={shot_type}
  category={category}&
  optional_tag={optional_tag}
  ```
- 基本的に `GET /replays` リクエストと同じ
- 応答
  - `JSON`
    - `count`
    - フィルタ内容に当てはまるリプレイの個数が数値で返る

### `GET /replays/{replay_id}`

- ```
  GET /replays/{replay_id}
  ```
- 1個のリプレイファイルのメタデータを返す
- 応答
  - `JSON`
    - 対応するリプレイの `JSONリプレイメタデータ` が返る

### `GET /replays/{replay_id}/file`

- ```
  GET /replays/{replay_id}/file
  ```
- リプレイファイルを返す
- 応答
  - ファイル応答

### `POST /replays`

- ```
  POST /replays
  ```
- リクエストボディ
  - user_name
    - ユーザネーム
    - 30文字以下
  - category
    - `score_run`
    - `clear`
    - `no_bomb`
    - `no_miss`
    - `other`
  - optional_tag
    - 英数字のみ、1つだけ可
    - 50文字以下
  - upload_comment
    - 300文字以下
  - delete_password
    - 100文字以下
  - replay_file
    - 200KB以下
- 応答
  - `JSON`
    - 投稿したリプレイに対応する `JSONリプレイメタデータ`

### `DELETE /replays/{replay_id}`

- ```
  DELETE /replays/{replay_id}
  ```
- リクエストボディ
  - delete_password
    - 100文字以下
- 応答
  - 成功応答だけを返す


### `DELETE /internal/replays/{replay_id}`

- ```
  DELETE /internal/replays/{replay_id}
  ```
- 削除パスワード無しでリプレイ削除できる
- 応答
  - 成功応答だけを返す

### `GET /alcohol`

- ```
  GET /alcohol
  ```
- `418 I'm a teapot` を返す
- detail は `I can't give you alcohol, because I am a little teapot.`
- `cooktail` `wine` `sake` `beer` も同じ挙動を取る

## JSONリプレイメタデータ
- `game_id` と `stage_details` というキーを含んでいるJSONデータ
  - `game_id` は `thXX` 等から始まるゲーム識別子
  - `stage_details` は各面の詳細データが辞書形式で詰まった配列
    - スペルカードのリプレイや、小数作品でそもそも面の概念がない場合は空のリストが入る
    - 通しプレイであっても最終面はスコアやステージ以外のメタデータが存在しない。その場合は存在しない項目について `null` で返す
    - 各作品毎に任意のキーが入るのでクライアント側で良しなに解釈する
- `game_id` と `stage_details` 以外は各作品によって入るキーが異なる。
  - クライアント側で良しなに解釈する


## フロントエンドの概要

- 投稿一覧ページの仕様
  - 作品ごちゃまぜ
  - ゲーム毎
    - 機体