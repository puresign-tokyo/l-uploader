CREATE TABLE th128_replay(
    replay_id       SERIAL      NOT NULL,
    replay_name     TEXT        NOT NULL,
    shot_type       TEXT        NOT NULL,
    difficulty      TEXT        NOT NULL,
    total_score     INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    slowdown        FLOAT       NOT NULL,
    route           TEXT        NOT NULL,
    replay_type     TEXT        NOT NULL,

    PRIMARY KEY(replay_id)
);

CREATE TABLE th128_stage(
    replay_id       SERIAL      NOT NULL,
    stage           INT         NOT NULL,
    stage_score     INT         NOT NULL,
    motivation      INT         ,
    perfect_freeze  INT         ,
    frozen_area     INT         ,

    PRIMARY KEY(replay_id, stage)
);