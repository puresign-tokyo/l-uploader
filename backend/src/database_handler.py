import os
from contextlib import contextmanager
from log import log_manager
import psycopg
from base_database_handler import BaseDatabaseHandler
from datetime import datetime, date, timedelta
from replay_info import ReplayInfo
import hashlib
import secrets
from psycopg.rows import dict_row
from typing import Union

logger = log_manager.get_logger()


def encrypt_password(raw_password: str, salt: str):
    stretch_number = os.getenv("STRETCH_NUMBER")
    return hashlib.pbkdf2_hmac(
        "sha256",
        raw_password.encode(),
        (salt + str(os.getenv("HASH_PEPPER"))).encode(),
        int(stretch_number) if stretch_number is not None else 114514,
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


class SQLReplays:

    @staticmethod
    def insert_replay(
        database_handler: BaseDatabaseHandler,
        replay_info: ReplayInfo,
        user_name: str,
        category: str,
        optional_tag: str,
        upload_comment: str,
        raw_delete_password: str,
        uploaded_at: datetime,
        file_digest: str,
    ):
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        SELECT EXISTS (
                            SELECT 1 FROM posts WHERE file_digest = %s
                        ) AS file_exists
                    """,
                    (file_digest,),
                )
                row = cur.fetchone()
                if row is None:
                    raise RuntimeError("File digest check SQL returns None")
                if row["file_exists"]:
                    raise ValueError(
                        f"The file already exists. file digest is {file_digest}"
                    )

                salt = secrets.token_hex()
                encrypted_delete_password = encrypt_password(raw_delete_password, salt)
                cur.execute(
                    """
                        INSERT INTO posts(
                            game_id,
                            user_name,
                            uploaded_at,
                            upload_comment,
                            category,
                            optional_tag,
                            delete_password,
                            salt,
                            file_digest
                        )
                        VALUES(
                            %(game_id)s,
                            %(user_name)s,
                            %(uploaded_at)s,
                            %(upload_comment)s,
                            %(category)s,
                            %(optional_tag)s,
                            %(delete_password)s,
                            %(salt)s,
                            %(file_digest)s
                        )
                        RETURNING replay_id;
                    """,
                    {
                        "game_id": replay_info.convert_to_dict()["game_id"],
                        "user_name": user_name,
                        "uploaded_at": uploaded_at,
                        "upload_comment": upload_comment,
                        "category": category,
                        "optional_tag": optional_tag,
                        "delete_password": encrypted_delete_password,
                        "salt": salt,
                        "file_digest": file_digest,
                    },
                )
                returning = cur.fetchone()
                if returning == None or ("replay_id" not in returning):
                    raise RuntimeError(
                        f"Failed to insert replay metadata into database: user_name={user_name}"
                    )
                database_handler.insert_replay(returning["replay_id"], replay_info)

                logger.info(
                    f"Replay metadata is successfully inserted to database: replay_id={returning["replay_id"]}, user_name={user_name}"
                )
                return returning["replay_id"]

    @staticmethod
    def delete_replay(replay_id: int, raw_delete_password: str):
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        SELECT
                            game_id,
                            delete_password,
                            salt
                        FROM posts
                        WHERE
                            replay_id=%(replay_id)s
                    """,
                    {
                        "replay_id": replay_id,
                    },
                )
                rows = cur.fetchall()

                if len(rows) == 0:
                    raise ValueError(f"replay_id {replay_id} is not found")

                if len(rows) != 1:
                    raise RuntimeError(
                        f"Primary Key Violation — Multiple records found for replay_id {replay_id}"
                    )

    @staticmethod
    def select_replay_sorted(
        uploaded_date_since: date,
        uploaded_date_until: date,
        created_date_since: date,
        created_date_until: date,
        game_id: str,
        category: str,
        optional_tag: str,
    ):
        with db.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                query = """
                        SELECT
                            replay_id,
                            game_id,
                            user_name,
                            uploaded_at,
                            upload_comment,
                            category,
                            optional_tag
                        FROM posts
                        WHERE
                            %(uploaded_date_since)s <= uploaded_at::date
                            AND uploaded_at::date < %(uploaded_date_before)s
                            AND %(created_date_since)s <= created_at::date
                            AND created_at::date < %(created_date_before)s 
                    """

                params: dict[str, Union[str, date]] = {
                    "uploaded_date_since": uploaded_date_since,
                    "uploaded_date_before": uploaded_date_until + timedelta(days=1),
                    "created_date_since": created_date_since,
                    "created_date_before": created_date_until + timedelta(days=1),
                }

                if game_id != "":
                    query += "AND game_id = %(game_id)s"
                    params["game_id"] = game_id
                if category != "":
                    query += "AND category = %(category)"
                    params["category"] = category
                if optional_tag != "":
                    query += "AND optional_tag = %(optional_tag)s"
                    params["optional_tag"] = optional_tag

                cur.execute(
                    query,
                    params,
                )
                rows = cur.fetchall()

                # どうやって順番を保ったまま各作品データベースに振り分ける？

                # 条件
                # GameRegistry.identify_with_game_id(game_id) でパーサとdb_handlerが分かるものとする
                # 各作品のdb_handlerはこれから組むのでよしなにやれるものとする
