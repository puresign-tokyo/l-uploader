import os
from contextlib import contextmanager
from log import log_manager
import psycopg
from datetime import datetime
from replay_info import ReplayInfo
import hashlib
import secrets
from psycopg.rows import dict_row
from psycopg import sql
from mongo_handler import MongoHandler
from typing import Union
from file_handler import FileHandler
from getenv import getenv_secure, get_env_secure_bool

logger = log_manager.get_logger()

ALLOW_DUPLICATE_POSTS = get_env_secure_bool("ALLOW_DUPLICATE_POSTS")
STRETCH_NUMBER = int(getenv_secure("STRETCH_NUMBER"))
if STRETCH_NUMBER < 600000:
    raise ValueError(
        f"STRETCH_NUMBER is less than 600000. STRETCH_NUMBER: {STRETCH_NUMBER}"
    )
HASH_PEPPER = getenv_secure("HASH_PEPPER")


def encrypt_password(raw_password: str, salt: str):
    salted = hashlib.pbkdf2_hmac(
        "sha256",
        raw_password.encode(),
        salt.encode(),
        STRETCH_NUMBER,
    )
    return hashlib.pbkdf2_hmac("sha256", salted, HASH_PEPPER.encode(), 1)


def build_postgres_kwargs() -> str:
    "dbname=sample_db user=test password=test host=localhost port=5432"
    return f"""
                dbname={getenv_secure("POSTGRES_DB")}
                user={getenv_secure("POSTGRES_USER")}
                password={getenv_secure("POSTGRES_PASS")}
                host={getenv_secure("POSTGRES_HOST")}
                port={int(getenv_secure("POSTGRES_PORT"))}
            """


class PostgresClient:
    def __init__(self):
        self.db_kwargs = build_postgres_kwargs()

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def connect(self):
        with psycopg.connect(self.db_kwargs) as conn:
            logger.info("database connected")
            yield conn

    @contextmanager  # with句で返したものをyieldで返すことができるようにするデコレータ
    def transactional(self):
        with self.connect() as conn:
            with conn.transaction():
                logger.info("database transaction is started")
                yield conn


postgres = PostgresClient()


class SQLReplays:

    # psycopgはtransactionスコープでエラーが出ると自動でロールバックされるため
    # mongodbのエラーハンドリングをし明示的にロールバックしなくても良いことに注意
    # ただし消すときはmongodbとファイルはバッチ処理で消すようにすること

    @staticmethod
    def find_replay_id_by_digest(file_digest: str) -> str:
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    SELECT replay_id FROM posts WHERE file_digest = %s
                    """,
                    (file_digest,),
                )
                row = cur.fetchone()
                if row is not None:
                    logger.info(
                        f"The file already exists. file digest is {file_digest}"
                    )
                    return row["replay_id"]
                return ""

    @staticmethod
    def insert_replay(
        replay_info: ReplayInfo,
        user_name: str,
        category: str,
        optional_tag: str,
        upload_comment: str,
        raw_delete_password: str,
        uploaded_at: datetime,
        rep_raw: bytes,
        file_digest: str,
    ) -> dict:
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:

                if not ALLOW_DUPLICATE_POSTS:
                    cur.execute(
                        """
                        SELECT replay_id FROM posts WHERE file_digest = %s
                        """,
                        (file_digest,),
                    )
                    row = cur.fetchone()
                    if row is not None:
                        logger.info(
                            f"The file already exists. file digest is {file_digest}"
                        )
                        return {"state": "duplicate", "replay_id": row["replay_id"]}

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

                MongoHandler.insert_replay(
                    str(returning["replay_id"]), replay_info.convert_to_dict()
                )

                FileHandler.store_replay_file(
                    replay_id=str(returning["replay_id"]), rep_raw=rep_raw
                )

                logger.info(
                    f"Replay metadata is successfully inserted to database: replay_id={returning["replay_id"]}, user_name={user_name}"
                )
                return {"state": "success", "replay_id": returning["replay_id"]}

    @staticmethod
    def delete_replay(replay_id: int, raw_delete_password: str) -> dict:
        with postgres.transactional() as conn:
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
                    return {"state": "replay_not_found_postgres"}

                if len(rows) != 1:
                    raise RuntimeError(
                        f"Primary Key Violation — Multiple records found for replay_id {replay_id}"
                    )

                if (
                    encrypt_password(
                        raw_password=raw_delete_password, salt=rows[0]["salt"]
                    )
                    != rows[0]["delete_password"]
                ):
                    return {"state": "invalid_password"}

                cur.execute(
                    """
                        DELETE
                        FROM posts
                        WHERE
                            replay_id=%(replay_id)s
                    """,
                    {
                        "replay_id": replay_id,
                    },
                )

                return {"state": "success"}

    @staticmethod
    def delete_replay_without_pass(replay_id: int):
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        DELETE
                        FROM posts
                        WHERE
                            replay_id=%(replay_id)s
                    """,
                    {
                        "replay_id": replay_id,
                    },
                )

                return {"state": "success"}

    @staticmethod
    def delete_replay_until(uploaded_until: datetime):
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        DELETE
                        FROM posts
                        WHERE uploaded_at <= %(uploaded_until)s
                    """,
                    {"uploaded_until": uploaded_until},
                )

    @staticmethod
    def select_replay_game_id(replay_id: int):
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                        SELECT
                            game_id
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
                    return {"state": "replay_not_found_in_postgres"}

                if len(rows) != 1:
                    raise RuntimeError(
                        f"Primary Key Violation — Multiple records found for replay_id {replay_id}"
                    )

                return {"state": "success", "game_id": rows[0]["game_id"]}

    @staticmethod
    def select_replay_sorted(
        game_id: str,
        category: str,
        optional_tag: str,
        order: str,
        offset: int,
        limit: int,
    ):
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                base_sql = sql.SQL(
                    """
                        SELECT
                            replay_id,
                            game_id,
                            user_name,
                            uploaded_at,
                            upload_comment,
                            category,
                            optional_tag
                        FROM posts
                    """
                )

                conditions: list[sql.Composable] = []
                params: dict[str, Union[int, str]] = {}

                if game_id != "all":
                    conditions.append(
                        sql.SQL("game_id = {}").format(sql.Placeholder("game_id"))
                    )
                    params["game_id"] = game_id
                if category != "all":
                    conditions.append(
                        sql.SQL("category = {}").format(sql.Placeholder("category"))
                    )
                    params["category"] = category
                if optional_tag != "":
                    conditions.append(
                        sql.SQL("optional_tag = {}").format(
                            sql.Placeholder("optional_tag")
                        )
                    )
                    params["optional_tag"] = optional_tag

                if conditions:
                    where_sql = sql.SQL(" WHERE ") + sql.SQL(" AND ").join(conditions)
                else:
                    where_sql = sql.SQL("")

                if order == "asc":
                    order_sql = sql.SQL(" ORDER BY uploaded_at ASC")
                elif order == "desc":
                    order_sql = sql.SQL(" ORDER BY uploaded_at DESC")
                else:
                    raise RuntimeError(f"order is not asc or desc. order is {order}")

                limit_sql = sql.SQL(" LIMIT {limit} OFFSET {offset}").format(
                    limit=sql.Placeholder("limit"), offset=sql.Placeholder("offset")
                )
                params["limit"] = limit
                params["offset"] = offset

                cur.execute(
                    base_sql + where_sql + order_sql + limit_sql,
                    params,
                )
                rows = cur.fetchall()

                replay_ids = [row["replay_id"] for row in rows]

                replay_metas = MongoHandler.read_replays(replay_ids=replay_ids)

                returning = []
                for row in rows:
                    if str(row["replay_id"]) in replay_metas:
                        post = {}
                        post["replay_meta"] = replay_metas[str(row["replay_id"])]
                        post["replay_id"] = row["replay_id"]
                        post["game_id"] = row["game_id"]
                        post["user_name"] = row["user_name"]
                        post["uploaded_at"] = row["uploaded_at"].isoformat()
                        post["upload_comment"] = row["upload_comment"]
                        post["category"] = row["category"]
                        post["optional_tag"] = row["optional_tag"]
                        returning.append(post)
                return {"state": "success", "posts": returning}

    @staticmethod
    def count_replays(
        game_id: str,
        category: str,
        optional_tag: str,
    ) -> dict:
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                base_sql = sql.SQL(
                    """
                        SELECT
                            COUNT(*)
                        FROM posts
                    """
                )

                conditions: list[sql.Composable] = []
                params: dict[str, str] = {}

                if game_id != "all":
                    conditions.append(
                        sql.SQL("game_id = {}").format(sql.Placeholder("game_id"))
                    )
                    params["game_id"] = game_id
                if category != "all":
                    conditions.append(
                        sql.SQL("category = {}").format(sql.Placeholder("category"))
                    )
                    params["category"] = category
                if optional_tag != "":
                    conditions.append(
                        sql.SQL("optional_tag = {}").format(
                            sql.Placeholder("optional_tag")
                        )
                    )
                    params["optional_tag"] = optional_tag

                if conditions:
                    where_sql = sql.SQL(" WHERE ") + sql.SQL(" AND ").join(conditions)
                else:
                    where_sql = sql.SQL("")

                cur.execute(
                    base_sql + where_sql,
                    params,
                )
                rows = cur.fetchall()

                if len(rows) != 1:
                    raise RuntimeError(
                        f"Multi result in sql count request: game_id={game_id}, category={category}, optional_tag={optional_tag}"
                    )

                return {"state": "success", "count": rows[0]["count"]}

    @staticmethod
    def select_replay(replay_id: int) -> dict:
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
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
                        replay_id=%(replay_id)s
                    """,
                    {"replay_id": replay_id},
                )
                rows = cur.fetchall()
                if len(rows) == 0:
                    return {"state": "replay_not_found_in_postgres"}

                if len(rows) != 1:
                    raise RuntimeError(
                        f"Primary Key Violation — Multiple records found for replay_id {replay_id}"
                    )

                replay_meta = MongoHandler.read_replay(replay_id=str(replay_id))

                return {
                    "state": "success",
                    "post": {
                        "replay_meta": replay_meta,
                        "replay_id": replay_id,
                        "game_id": rows[0]["game_id"],
                        "user_name": rows[0]["user_name"],
                        "uploaded_at": rows[0]["uploaded_at"].isoformat(),
                        "upload_comment": rows[0]["upload_comment"],
                        "category": rows[0]["category"],
                        "optional_tag": rows[0]["optional_tag"],
                    },
                }

    @staticmethod
    def integrity_sync():
        with postgres.transactional() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                logger.info("integrity sync started.")
                cur.execute(
                    """
                        SELECT
                            replay_id
                        FROM posts
                    """
                )
                rows = cur.fetchall()
                postgres_replay_ids = {str(row["replay_id"]) for row in rows}
                mongo_replay_ids = set(MongoHandler.select_all_replay_ids())
                file_replay_ids = set(FileHandler.select_all_file_name())

                logger.info(f"postgres sets are {postgres_replay_ids}")
                logger.info(f"mongo sets are {mongo_replay_ids}")
                logger.info(f"file sets are {file_replay_ids}")

                intersection_replay_ids = (
                    postgres_replay_ids & mongo_replay_ids & file_replay_ids
                )
                logger.info(f"intersection sets are {intersection_replay_ids}")

                to_delete_postgres_replay_ids = (
                    postgres_replay_ids - intersection_replay_ids
                )
                to_delete_mongo_replay_ids = mongo_replay_ids - intersection_replay_ids
                to_delete_file_replay_ids = file_replay_ids - intersection_replay_ids

                if len(to_delete_postgres_replay_ids) != 0:
                    logger.warning(f"postgres delete {to_delete_file_replay_ids}")
                    cur.execute(
                        """
                            DELETE
                            FROM posts
                            WHERE replay_id = ANY(%(replay_id)s)
                        """,
                        {"replay_id": list(to_delete_postgres_replay_ids)},
                    )
                if len(to_delete_file_replay_ids) != 0:
                    logger.info(f"file delete {to_delete_file_replay_ids}")
                    FileHandler.delete_replays(list(to_delete_file_replay_ids))

                if len(to_delete_mongo_replay_ids) != 0:
                    logger.info(f"mongo delete {to_delete_mongo_replay_ids}")
                    MongoHandler.delete_replays(list(to_delete_mongo_replay_ids))
