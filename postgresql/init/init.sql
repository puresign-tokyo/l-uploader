

CREATE TABLE posts(
    replay_id           SERIAL      NOT NULL,
    game_id             TEXT        NOT NULL,
    user_name           TEXT        NOT NULL,
    uploaded_at         TIMESTAMP WITH TIME ZONE  NOT NULL,
    upload_comment      TEXT        ,
    category            TEXT        CHECK (category IN ('score_run', 'no_bomb', 'no_miss', 'clear', 'others')),
    optional_tag        TEXT        ,
    delete_password     TEXT        NOT NULL,
    salt                TEXT        NOT NULL,
    file_digest         TEXT        NOT NULL,
    PRIMARY KEY(replay_id)

);