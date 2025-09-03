# l-uploader

えるろだ

## 使用方法

1. `th-uploader/.env` ファイルを作成し、以下を定義する（docker-compose.yml に準拠）

   ```
   # フロント/バックエンドの公開設定
   BACKEND_HOST_EXTERNAL={外部公開するバックエンドのホスト名}
   BACKEND_PORT_EXTERNAL={外部公開するバックエンドのポート}
   BACKEND_PORT_INTERNAL={コンテナ内バックエンドのポート(例: 5001)}

   FRONTEND_HOST_EXTERNAL={外部公開するフロントエンドのホスト名}
   FRONTEND_PORT_EXTERNAL={外部公開するフロントエンドのポート}
   FRONTEND_PORT_INTERNAL={コンテナ内フロントエンドのポート(例: 3000)}

   HTTP_PROTOCOL={http または https}
   ALLOW_FRONTEND_ORIGIN={フロントエンドのオリジン(例: http://example.com:8080)}
   USE_REVERSE_PROXY={True/False}
   USE_CLOUDFLARE_PROXY={True/False}

   # Postgres
   POSTGRES_DB={DB名}
   POSTGRES_USER={DB管理者ユーザ}
   POSTGRES_PASS={DB管理者パスワード}
   POSTGRES_APP_USER={アプリ用ユーザ}
   POSTGRES_APP_PASS={アプリ用ユーザのパスワード}
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432

   # MongoDB
   MONGO_DATABASE={DB名}
   MONGO_HOST=mongo
   MONGO_PORT=27017
   MONGO_ROOT_USER={rootユーザ}
   MONGO_ROOT_PASS={rootパスワード}
   MONGO_APP_USER={アプリ用ユーザ}
   MONGO_APP_PASS={アプリ用パスワード}

   # Redis
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_USER={ユーザ名}
   REDIS_PASS={パスワード}
   REDIS_LOCK_TIMEOUT_SEC=10
   REDIS_LOCK_BLOCKING_TIMEOUT_SEC=5

   # 認証/セキュリティ
   STRETCH_NUMBER={600000以上の数値}
   HASH_PEPPER={任意のペッパー文字列}
   ALLOW_DUPLICATE_POSTS={True/False}

   # UI/バリデーション設定
   USERNAME_LENGTH_LIMIT={数値}
   USERNAME_SHARE_LENGTH_LIMIT={数値}
   UPLOAD_COMMENT_LENGTH_LIMIT={数値}
   UPLOAD_COMMENT_SHARE_LENGTH_LIMIT={数値}
   FILESIZE_KB_LIMIT={数値}
   DELETE_PASSWORD_LENGTH_LIMIT={数値}
   OPTIONAL_TAG_LENGTH_LIMIT={数値}
   POSTS_PER_PAGE={数値}
   MAX_PAGINATION_PAGES={数値}

   # レート制限/キャッシュ設定
   REPLAY_RATE_POST_WINDOW_SEC={数値}
   REPLAY_RATE_POST_MAX_REQUEST={数値}
   REPLAY_RATE_DELETE_WINDOW_SEC={数値}
   REPLAY_RATE_DELETE_MAX_REQUEST={数値}
   CACHE_EXPIRE_SEC={数値}

   # reCAPTCHA (必要な場合のみ)
   RECAPTCHA_ENABLED={True/False}
   RECAPTCHA_SITEKEY={サイトキー}
   RECAPTCHA_SECRET={シークレット}
   ```

   補足: `STRETCH_NUMBER` は 600000 以上を指定してください（セキュリティ要件）。

2. ソースの変更は不要です。CORS の許可元は `.env` の `ALLOW_FRONTEND_ORIGIN` で設定されます。

3. `sudo docker compose up --build`
