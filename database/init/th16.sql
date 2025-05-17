CREATE TABLE th16_replay(
    replay_id       SERIAL      NOT NULL,
    replay_name     TEXT        NOT NULL,
    shot_type       TEXT        NOT NULL,
    difficulty      TEXT        NOT NULL,
    total_score     INT         NOT NULL,
    created_at      TIMESTAMP   NOT NULL,
    slowdown        FLOAT       NOT NULL,
    spell_card_id   INT         NOT NULL,
    replay_type     TEXT        NOT NULL,

    PRIMARY KEY(replay_id)
);

CREATE TABLE th16_stage(
    replay_id       SERIAL      NOT NULL,
    stage           INT         NOT NULL,
    stage_score     INT         NOT NULL,
    piv             INT         ,
    power           INT         ,
    lives           INT         ,
    life_pieces     INT         ,
    bombs           INT         ,
    bomb_pieces     INT         ,
    graze           INT         ,
    season_power    INT         ,

    PRIMARY KEY(replay_id, stage)
);