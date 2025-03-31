import psycopg

from replay import ReplayMetaData
import functools

from contextlib import contextmanager
import os

from datetime import datetime

# conn = psycopg.connect()
# cur = conn.cursor()
# cur.execute(query)


def build_db_kwargs() -> dict:
    "dbname=sample_db user=test password=test host=localhost port=5432"
    return dict(
        {
            "dbname": "replays",
            "user": os.getenv("POSTGRES_USER"),
            "password": os.getenv("POSTGRES_PASSWORD"),
            "host": "localhost",
            "port": "5432",
        }
    )


class DBClient:
    def __init__(self):
        self.db_kwargs = build_db_kwargs()

    @contextmanager
    def connect(self):
        with psycopg.connect(**build_db_kwargs()) as conn:
            yield conn

    @contextmanager
    def transactional(self):
        with self.connect() as conn:
            with conn.transaction():
                yield conn


db = DBClient()


def transactional(func):
    @functools.wraps(func)
    def _wrapper(*args, **kwargs):
        with db.connect() as conn:
            with db.transactional():
                return func(conn, *args, **kwargs)

    return _wrapper


class SQLReplays:

    @staticmethod
    @db.transactional()
    def insert_replay_meta_data(
        conn,
        replay_meta_data: ReplayMetaData,
        user_name: str,
        upload_comment: str,
        delete_password: str,
    ):
        with conn.cursor() as cur:
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
                        );
                        """,
                {
                    "user_name": user_name,
                    "replay_name": replay_meta_data.replay_name,
                    "created_at": replay_meta_data.created_at,
                    "stage": replay_meta_data.stage,
                    "score": replay_meta_data.score,
                    "uploaded_at": datetime.now(),
                    "game_version": replay_meta_data.game_version,
                    "upload_comment": upload_comment,
                    "delete_password": delete_password,
                },
            )

    @staticmethod
    @transactional
    def delete_replay(conn, replay_id):
        with conn.cursor as cur:
            cur.execute("DELETE FROM replays WHERE replay_id = %s;", (replay_id,))

    @staticmethod
    @db.connect()
    def select_replay(conn,replay_id):


class SQLBlackList:
    @staticmethod
    @transactional
    def insert_blacklist():
        pass
