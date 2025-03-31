CREATE TABLE replays(
    replay_id           INT             NOT NULL AUTO_INCREMENT,
    user_name           TEXT            NOT NULL,
    replay_name         TEXT            NOT NULL,
    created_at          TIMESTAMP       NOT NULL,
    stage               TEXT            CHECK (stage IN('Stage1', 'Stage2', 'Stage3', 'ALL')),
    score               INT             NOT NULL,
    uploaded_at         TIMESTAMP       NOT NULL,
    game_version        TEXT            NOT NULL, -- DB作成時点では [1.00a] のみが入る
    slow_late           FLOAT           NOT NULL,
    upload_comment      TEXT            ,
    delete_password     BYTEA           NOT NULL, -- SHA-256

    PRIMARY KEY(replay_id)
);

CREATE TABLE blacklist(
    banned_address  INET            NOT NULL,

    PRIMARY KEY(banned_address)
);