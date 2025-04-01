import psycopg
from psycopg.rows import dict_row
from typing import List
from replay import ReplayPost
import functools

from contextlib import contextmanager
import os

from datetime import datetime

# conn = psycopg.connect()
# cur = conn.cursor()
# cur.execute(query)


def build_db_kwargs() -> str:
    "dbname=sample_db user=test password=test host=localhost port=5432"
    return f"""
                dbname={os.getenv("POSTGRES_USER")}
                user={os.getenv("POSTGRES_USER")}
                password={os.getenv("POSTGRES_PASSWORD")}
                host=database
                port=5432
            """


class DBClient:
    def __init__(self):
        self.db_kwargs = build_db_kwargs()

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def connect(self):
        with psycopg.connect(build_db_kwargs()) as conn:
            yield conn

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def transactional(self):
        with self.connect() as conn:
            with conn.transaction():
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
                            delete_password
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
                            %(delete_password)s
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
                        "delete_password": replay_post.delete_password,
                    },
                )

                returning = cur.fetchone()
                if returning == None:
                    raise ValueError("DBにリプレイメタデータをINSERTできませんでした")
                return returning["replay_id"]

    @staticmethod
    def delete_replay(replay_id):
        with db.transactional() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM replays WHERE replay_id = %s;", (replay_id,))

    @staticmethod
    def select_replay(replay_id) -> ReplayPost:
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
                    raise ValueError(
                        "リプレイファイルのメタデータを取得できませんでした"
                    )
                print(selected)
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
                    delete_password=selected["delete_password"],
                )
                if cur.fetchone() != None:
                    raise ValueError("データベースの不整合が起こっています")
                return replay_post

    @staticmethod
    def select_replay_sorted(
        sort: str, offset: int, limit: int, is_asc: bool
    ) -> List[ReplayPost]:
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                if is_asc:
                    order = "ASC"
                else:
                    order = "DESC"
                print(sort, order)
                cur.execute(
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
                        ORDER BY %(sort)s DESC
                        LIMIT %(limit)s OFFSET %(offset)s;
                    """,
                    {
                        "sort": sort,
                        # "order": order,
                        "limit": limit,
                        "offset": offset,
                    },
                )
                selected = cur.fetchone()
                if selected == None:
                    raise ValueError(
                        "リプレイファイルのメタデータを取得できませんでした"
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
                            delete_password=selected["delete_password"],
                        )
                    )
                    selected = cur.fetchone()
                    if selected == None:
                        break
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
