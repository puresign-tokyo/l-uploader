CREATE TABLE th07_replay(
    replay_id       SERIAL      NOT NULL,
    replay_name     TEXT        NOT NULL,
    shot_type       TEXT        NOT NULL,
    difficulty      TEXT        NOT NULL,
    total_score     INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    slowdown        FLOAT       NOT NULL,
    replay_type     TEXT        NOT NULL,

    PRIMARY KEY(replay_id)
);

CREATE TABLE th07_stage(
    replay_id       SERIAL      NOT NULL,
    stage           INT         NOT NULL,
    stage_score     INT         NOT NULL,
    point_items     INT         NOT NULL,
    graze           INT         ,
    piv             INT         ,
    cherry          INT         ,
    cherry_max      INT         ,
    power           INT         ,
    lives           INT         ,
    bombs           INT         ,

    PRIMARY KEY(replay_id, stage)
);