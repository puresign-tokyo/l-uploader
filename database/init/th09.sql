CREATE TABLE th09_replay(
    replay_id       SERIAL      NOT NULL,
    replay_name     TEXT        NOT NULL,
    shot_type       TEXT        NOT NULL,
    difficulty      TEXT        NOT NULL,
    total_score     INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    replay_type     TEXT        NOT NULL,

    PRIMARY KEY(replay_id)
);

CREATE TABLE th09_stage(
    replay_id       SERIAL      NOT NULL,
    stage           INT         NOT NULL,
    stage_score     INT         NOT NULL,
    lives           INT         ,
    p1_cpu          BOOLEAN     ,
    p2_cpu          BOOLEAN     ,
    p2_shot         TEXT        ,
    p2_score        INT         ,

    PRIMARY KEY(replay_id, stage)
);