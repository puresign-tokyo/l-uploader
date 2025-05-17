CREATE TABLE th11_replay(
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

CREATE TABLE th11_stage(
    replay_id       SERIAL      NOT NULL,
    stage           INT         NOT NULL,
    stage_score     INT         NOT NULL,
    piv             INT         ,
    power           INT         ,
    lives           INT         ,
    life_pieces     INT         ,
    graze           INT         ,

    PRIMARY KEY(replay_id, stage)
);