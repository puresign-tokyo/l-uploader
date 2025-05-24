CREATE TABLE th143_replay(
    replay_id       SERIAL      NOT NULL,
    replay_name     TEXT        NOT NULL,
    level           INT         NOT NULL,
    scene           INT         NOT NULL,
    total_score     INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    slowdown        FLOAT       NOT NULL,

    PRIMARY KEY(replay_id)
);