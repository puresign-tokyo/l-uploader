import psycopg
from psycopg.rows import dict_row
from psycopg import sql
from typing import List
from replay import ReplayPost
import functools
import secrets
import hashlib

from contextlib import contextmanager
import os

from datetime import datetime

from log import log_manager

STRETCH_NUMBER = 126990

# conn = psycopg.connect()
# cur = conn.cursor()
# cur.execute(query)

logger = log_manager.get_logger()


def encrypt_password(raw_password: str, salt: str):
    return hashlib.pbkdf2_hmac(
        "sha256",
        raw_password.encode(),
        (salt + str(os.getenv("HASH_PEPPER"))).encode(),
        STRETCH_NUMBER,
    ).hex()


def build_db_kwargs() -> str:
    "dbname=sample_db user=test password=test host=localhost port=5432"
    return f"""
                dbname={os.getenv("POSTGRES_USER")}
                user={os.getenv("POSTGRES_USER")}
                password={os.getenv("POSTGRES_PASSWORD")}
                host={os.getenv("DATABASE_HOST")}
                port={os.getenv("DATABASE_PORT")}
            """


class DBClient:
    def __init__(self):
        self.db_kwargs = build_db_kwargs()

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def connect(self):
        with psycopg.connect(build_db_kwargs()) as conn:
            logger.info("database connected")
            yield conn

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def transactional(self):
        with self.connect() as conn:
            with conn.transaction():
                logger.info("database transaction is started")
                yield conn


db = DBClient()


# def transactional(func):
#     @functools.wraps(func)
#     def _wrapper(*args, **kwargs):
#         with db.connect() as conn:
#             with db.transactional():
#                 return func(conn, *args, **kwargs)
#     return _wrapper


class SQLReplays:

    @staticmethod
    def insert_replay_meta_data(replay_post: ReplayPost):
        salt = secrets.token_hex()
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        INSERT INTO replays(
                            user_name,
                            replay_name,
                            created_at,
                            stage,
                            score,
                            uploaded_at,
                            game_version,
                            slow_rate,
                            upload_comment,
                            delete_password,
                            salt
                        )
                        VALUES(
                            %(user_name)s,
                            %(replay_name)s,
                            %(created_at)s,
                            %(stage)s,
                            %(score)s,
                            %(uploaded_at)s,
                            %(game_version)s,
                            %(slow_rate)s,
                            %(upload_comment)s,
                            %(delete_password)s,
                            %(salt)s
                        )
                        RETURNING replay_id;
                        """,
                    {
                        "user_name": replay_post.user_name,
                        "replay_name": replay_post.replay_meta_data.replay_name,
                        "created_at": replay_post.replay_meta_data.created_at,
                        "stage": replay_post.replay_meta_data.stage,
                        "score": replay_post.replay_meta_data.score,
                        "uploaded_at": datetime.now().replace(microsecond=0),
                        "game_version": replay_post.replay_meta_data.game_version,
                        "slow_rate": replay_post.replay_meta_data.slow_rate,
                        "upload_comment": replay_post.upload_comment,
                        "delete_password": encrypt_password(
                            replay_post.delete_password, salt
                        ),
                        "salt": salt,
                    },
                )

                returning = cur.fetchone()
                if returning == None:
                    raise ValueError(
                        f"Failed to insert replay metadata into database: user_name={replay_post.user_name}"
                    )
                logger.info(
                    f"Replay metadata is successfully inserted to database: replay_id={returning["replay_id"]}, user_name={replay_post.user_name}"
                )
                return returning["replay_id"]

    @staticmethod
    def delete_replay(replay_id, requested_raw_delete_password):
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                # cur.execute("DELETE FROM replays WHERE replay_id = %s;", (replay_id,))
                cur.execute(
                    "SELECT user_name, delete_password, salt FROM replays WHERE replay_id=%s",
                    (replay_id,),
                )

                selected = cur.fetchone()

                if selected == None:
                    raise KeyError(
                        f"No replay found for deletion: replay_id={replay_id}"
                    )
                logger.info(
                    f"Replay found for deletion: replay_id={replay_id}, user_name={selected["user_name"]}"
                )

                if (
                    encrypt_password(requested_raw_delete_password, selected["salt"])
                    != selected["delete_password"]
                ):
                    raise ValueError(
                        f"Password verification failed: replay_id={replay_id}, user_name{selected["user_name"]}"
                    )
                logger.info(
                    f"Password verification succeeded: replay_id={replay_id}, user_name={selected["user_name"]}"
                )

                cur.execute("DELETE FROM replays WHERE replay_id=%s", (replay_id,))
                logger.info(
                    f"Replay metadata deleted from database: replay_id={replay_id}, user_name={selected["user_name"]}"
                )

    @staticmethod
    def select_replay(replay_id: int) -> ReplayPost:
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        SELECT
                            user_name,
                            replay_name,
                            created_at,
                            stage,
                            score,
                            uploaded_at,
                            game_version,
                            slow_rate,
                            upload_comment,
                            delete_password
                        FROM replays
                        WHERE replay_id=%s;
                    """,
                    (replay_id,),
                )
                selected = cur.fetchone()
                if selected == None:
                    raise KeyError(
                        f"No replay found for deletion in database: replay_id={replay_id}"
                    )
                logger.info(
                    f"Replay found for deletion: replay_id={replay_id}, user_name={selected["user_name"]}"
                )

                replay_post = ReplayPost.new_from_input(
                    replay_id=replay_id,
                    user_name=selected["user_name"],
                    replay_name=selected["replay_name"],
                    created_at=selected["created_at"],
                    stage=selected["stage"],
                    score=selected["score"],
                    uploaded_at=selected["uploaded_at"],
                    game_version=selected["game_version"],
                    slow_rate=selected["slow_rate"],
                    upload_comment=selected["upload_comment"],
                )
                if cur.fetchone() != None:
                    raise KeyError(
                        f"Data integrity error: expected one record for replay_id={replay_id}, but found multi records. "
                        "This indicates a possible primary key violation or corruption in the replay metadata table."
                    )  # fetchallを使って全ての件数取得すれば何件ヒットしてしまったかを検知出来そう？
                return replay_post

    @staticmethod
    def select_replay_sorted(
        sort: str, offset: int, limit: int, is_asc: bool
    ) -> List[ReplayPost]:
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                # ASCとDESCを埋め込むことができない為冗長な書き方をしている
                if is_asc:
                    cur.execute(
                        sql.SQL(
                            """
                            SELECT
                                replay_id,
                                user_name,
                                replay_name,
                                created_at,
                                stage,
                                score,
                                uploaded_at,
                                game_version,
                                slow_rate,
                                upload_comment,
                                delete_password
                            FROM replays
                            ORDER BY {} ASC LIMIT %s OFFSET %s;
                        """
                        ).format(
                            sql.Identifier(sort),
                        ),
                        (limit, offset),
                    )
                else:
                    cur.execute(
                        sql.SQL(
                            """
                            SELECT
                                replay_id,
                                user_name,
                                replay_name,
                                created_at,
                                stage,
                                score,
                                uploaded_at,
                                game_version,
                                slow_rate,
                                upload_comment,
                                delete_password
                            FROM replays
                            ORDER BY {} DESC LIMIT %s OFFSET %s;
                        """
                        ).format(
                            sql.Identifier(sort),
                        ),
                        (limit, offset),
                    )

                selected = cur.fetchone()
                if selected == None:
                    raise ValueError(
                        f"No replays found for the given query parameters: sort='{sort}', order='{"ASC" if is_asc else "DESC"}', offset={offset}, limit={limit}."
                    )
                replay_posts = []
                while True:
                    replay_posts.append(
                        ReplayPost.new_from_input(
                            replay_id=selected["replay_id"],
                            user_name=selected["user_name"],
                            replay_name=selected["replay_name"],
                            created_at=selected["created_at"],
                            stage=selected["stage"],
                            score=selected["score"],
                            uploaded_at=selected["uploaded_at"],
                            game_version=selected["game_version"],
                            slow_rate=selected["slow_rate"],
                            upload_comment=selected["upload_comment"],
                        )
                    )
                    selected = cur.fetchone()
                    if selected == None:
                        break
                logger.info(
                    f"Successfully retrieved {len(replay_posts)} replays sorted by '{sort}' in {"ASC" if is_asc else "DESC"} order (offset={offset}, limit={limit})."
                )
                return replay_posts


class SQLBlackList:
    @staticmethod
    def insert_blacklist(banned_address):
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        INSERT INTO blacklist(banned_address) VALUES(%s)
                    """,
                    (banned_address),
                )

    @staticmethod
    def is_blacklist(evaluating_address) -> bool:
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        SELECT banned_address FROM blacklist where banned_address=%s
                    """,
                    (evaluating_address),
                )
                if evaluating_address == None:
                    return False
                return True
