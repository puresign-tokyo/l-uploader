CREATE TABLE replays(
    replay_id           SERIAL          NOT NULL,
    user_name           TEXT            NOT NULL,
    replay_name         TEXT            NOT NULL,
    created_at          TIMESTAMP       NOT NULL,
    stage               TEXT            CHECK (stage IN('1', '1 〜 2', '1 ～ 3', 'All Clear')),
    score               INT             NOT NULL,
    uploaded_at         TIMESTAMP       NOT NULL,
    game_version        TEXT            NOT NULL, -- DB作成時点では [1.00a] のみが入る
    slow_rate           FLOAT           NOT NULL,
    upload_comment      TEXT            ,
    delete_password     TEXT           NOT NULL, -- SHA-256
    salt                TEXT           NOT NULL,

    PRIMARY KEY(replay_id)
);