# th-uploader

東方リプレイアップローダ


## 使用方法

1. `th-uploader/.env` ファイルを作成し、以下のようなファイル内容にする

    ```
    DB_USER={DBのユーザ名}
    DB_PASSWORD={DBのパスワード}
    HASH_PEPPER={ハッシュのペッパー}
    DATABASE_HOST={DBが動いているホスト名}
    DATABASE_PORT={DBが動いているポート}
    BACKEND_HOST_INTERNAL={内部ネットワークから見たバックエンドが動いているホスト名}
    BACKEND_PORT_INTERNAL={内部ネットワークから見たバックエンドが動いているポート}
    BACKEND_HOST_EXTERNAL={外部ネットワークから見たバックエンドが動いているホスト名}
    BACKEND_PORT_EXTERNAL={外部ネットワークから見たバックエンドが動いているポート}
    FRONTEND_HOST_INTERNAL={内部ネットワークから見たフロントエンドが動いているホスト名}
    FRONTEND_PORT_INTERNAL={内部ネットワークから見たフロントエンドが動いているポート}
    FRONTEND_HOST_EXTERNAL={外部ネットワークから見たフロントエンドが動いているホスト名}
    FRONTEND_PORT_EXTERNAL={外部ネットワークから見たフロントエンドが動いているポート}
    HTTP_PROTOCOL={http or https}
    ALLOW_FRONTEND_ORIGIN={フロントエンドが動いているオリジン}
    ```

2. `th-uploader/backend/app.py` にて `ALLOW_ORIGIN` に外から見たバックエンドが動いているオリジンを代入する

3. `sudo docker compose up --build`
