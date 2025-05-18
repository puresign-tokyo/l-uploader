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
  uploaded_after={upload_after}&
  uploaded_before={upload_before}&
  created_after={created_after}&
  created_before={created_before}&
  offset={offset_num}&
  limit={limit_num}&
  game_id={game_id}&
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
- `[created | uploaded]_[after | before]`
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

### `GET /replays/{replay_id}`

- ```
  GET /replays/{replay_id}
  ```
- 1個のリプレイファイルのメタデータを返す

### `GET /replays/{replay_id}/file`

- ```
  GET /replays/{replay_id}/file
  ```
- リプレイファイルを返す

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

### `DELETE /replays/{replay_id}`

- ```
  DELETE /replays/{replay_id}
  ```
- リクエストボディ
  - delete_password
    - 100文字以下


### `DELETE /internal/replays/{replay_id}`

- ```
  DELETE /internal/replays/{replay_id}
  ```
- 削除パスワード無しでリプレイ削除できる

### `GET /alcohol`

- ```
  GET /alcohol
  ```
- `418 I'm a teapot` を返す
- detail は `I can't give you alcohol, because I am a little teapot.`
- `cooktail` `wine` `sake` `beer` も同じ挙動を取る