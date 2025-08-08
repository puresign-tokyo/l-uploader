import http_requester as http_requester
from log import log_manager
from postgres_handler import SQLReplays
from postgres_handler import SQLReplays
from file_handler import FileHandler
from game_registry import GameRegistry
from datetime import datetime
from hashlib import sha256
import filename
from getenv import getenv_secure, get_env_secure_bool
from cache_handler import CacheClient

logger = log_manager.get_logger()

POSTS_PER_PAGE = int(getenv_secure("POSTS_PER_PAGE"))
MAX_PAGINATION_PAGES = int(getenv_secure("MAX_PAGINATION_PAGES"))

REPLAY_RATE_POST_WINDOW_SEC = int(getenv_secure("REPLAY_RATE_POST_WINDOW_SEC"))
REPLAY_RATE_POST_MAX_REQUEST = int(getenv_secure("REPLAY_RATE_POST_MAX_REQUEST"))
REPLAY_RATE_DELETE_WINDOW_SEC = int(getenv_secure("REPLAY_RATE_DELETE_WINDOW_SEC"))
REPLAY_RATE_DELETE_MAX_REQUEST = int(getenv_secure("REPLAY_RATE_DELETE_MAX_REQUEST"))
CACHE_EXPIRE_SEC = int(getenv_secure("CACHE_EXPIRE_SEC"))

RECAPTCHA_ENABLED = get_env_secure_bool("RECAPTCHA_ENABLED")


CACHE_NAMESPACE_RATELIMIT_POST_IP = "ratelimit_post_ip_addr"
CACHE_NAMESPACE_SELECT_REPLAY_ID = "select_replay_id"
CACHE_NAMESPACE_SELECT_REPLAYS = "select_replays"
CACHE_NAMESPACE_DOWNLOAD_REPLAY_ID = "download_replay_id"
CACHE_NAMESPACE_RATELIMIT_DELETE_IP = "ratelimit_delete_ip_addr"
CACHE_NAMESPACE_COUNT_REPLAYS = "count_replays"
cache_client = CacheClient()


class Usecase:

    @staticmethod
    def post_replay(
        ip_addr: str,
        rep_raw: bytes,
        user_name: str,
        category: str,
        optional_tag: str,
        upload_comment: str,
        uploaded_at: datetime,
        raw_delete_password: str,
        recaptcha_token: str,
    ):
        if (
            cache_client.counter(
                f"{CACHE_NAMESPACE_RATELIMIT_POST_IP}:{ip_addr}",
                REPLAY_RATE_POST_WINDOW_SEC,
            )
            > REPLAY_RATE_POST_MAX_REQUEST
        ):
            return {"state": "rate_limit_exceeded"}

        if RECAPTCHA_ENABLED and not (
            http_requester.is_verified_recaptcha_token(recaptcha_token)
        ):
            logger.info("recaptcha authz failed")
            return {"state": "recaptcha_failed"}
        logger.info("recaptcha authz success")

        game = GameRegistry.identify_with_replayfile(rep_raw)
        replay_info = game["parser"].parse(rep_raw)
        logger.info(f"replay_parsed: {replay_info.convert_to_dict()}")

        file_digest = sha256(rep_raw).hexdigest()

        result_sql = SQLReplays.insert_replay(
            replay_info=replay_info,
            user_name=user_name,
            category=category,
            optional_tag=optional_tag,
            upload_comment=upload_comment,
            raw_delete_password=raw_delete_password,
            uploaded_at=uploaded_at,
            rep_raw=rep_raw,
            file_digest=file_digest,
        )
        cache_client.delete_prefix_list("*", "cache")

        return result_sql

    @staticmethod
    def select_replays(
        game_id: str,
        category: str,
        optional_tag: str,
        order: str,
        page: int,
    ):
        if optional_tag == "" and (
            (
                cache := cache_client.get(
                    f"{CACHE_NAMESPACE_SELECT_REPLAYS}:{game_id}:{category}:{order}:{page}"
                )
            )
            is not None
        ):
            return cache
        if page == -1:
            offset = 0
            limit = POSTS_PER_PAGE * MAX_PAGINATION_PAGES
        else:
            offset = page * POSTS_PER_PAGE
            limit = POSTS_PER_PAGE

        result = SQLReplays.select_replay_sorted(
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
            order=order,
            offset=offset,
            limit=limit,
        )

        for post in result["posts"]:
            post["filename"] = (
                f"{post["game_id"]}_ud{filename.id_to_filename(post["replay_id"])}.rpy"
            )

        if optional_tag == "":
            cache_client.insert_if_not_exists(
                f"{CACHE_NAMESPACE_SELECT_REPLAYS}:{game_id}:{category}:{order}:{page}",
                result["posts"],
                CACHE_EXPIRE_SEC,
            )

        return result["posts"]

    @staticmethod
    def count_replays(
        game_id: str,
        category: str,
        optional_tag: str,
    ) -> dict:
        if optional_tag == "" and (
            (
                cache := cache_client.get(
                    f"{CACHE_NAMESPACE_COUNT_REPLAYS}:{game_id}:{category}"
                )
            )
            is not None
        ):
            return cache
        returning = SQLReplays.count_replays(
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
        )
        if optional_tag == "":
            cache_client.insert_if_not_exists(
                f"{CACHE_NAMESPACE_COUNT_REPLAYS}:{game_id}:{category}",
                returning,
                CACHE_EXPIRE_SEC,
            )
        return returning

    @staticmethod
    def select_replay(replay_id: int):
        if (
            cache := cache_client.get(f"{CACHE_NAMESPACE_SELECT_REPLAY_ID}:{replay_id}")
        ) is not None:
            return cache
        result = SQLReplays.select_replay(replay_id)
        if result["state"] != "success":
            cache_client.insert_if_not_exists(
                f"{CACHE_NAMESPACE_SELECT_REPLAY_ID}:{replay_id}",
                result,
                CACHE_EXPIRE_SEC,
            )
            return result
        result["post"][
            "filename"
        ] = f"{result["post"]["game_id"]}_ud{filename.id_to_filename(result["post"]["replay_id"])}.rpy"
        cache_client.insert_if_not_exists(
            f"{CACHE_NAMESPACE_SELECT_REPLAY_ID}:{replay_id}",
            result,
            CACHE_EXPIRE_SEC,
        )
        return result

    @staticmethod
    def download_replay(replay_id: int):
        if (
            cache := cache_client.get(
                f"{CACHE_NAMESPACE_DOWNLOAD_REPLAY_ID}:{replay_id}"
            )
        ) is not None:
            return cache
        result_sql = SQLReplays.select_replay_game_id(replay_id=replay_id)
        if result_sql["state"] != "success":
            cache_client.insert_if_not_exists(
                f"{CACHE_NAMESPACE_DOWNLOAD_REPLAY_ID}:{replay_id}",
                result_sql,
                CACHE_EXPIRE_SEC,
            )
            return result_sql

        # read処理なのでトランザクション外でも許される
        result_file = FileHandler.get_replay_file_path(str(replay_id))
        if result_file["state"] != "success":
            cache_client.insert_if_not_exists(
                f"{CACHE_NAMESPACE_DOWNLOAD_REPLAY_ID}:{replay_id}",
                result_file,
                CACHE_EXPIRE_SEC,
            )
            return result_file

        returning = {
            "state": "success",
            "path": result_file["path"],
            "filename": f"{result_sql["game_id"]}_ud{filename.id_to_filename(replay_id)}.rpy",
        }
        cache_client.insert_if_not_exists(
            f"{CACHE_NAMESPACE_DOWNLOAD_REPLAY_ID}:{replay_id}",
            returning,
            CACHE_EXPIRE_SEC,
        )
        return returning

    @staticmethod
    def delete_replay(ip_addr: str, replay_id: int, raw_delete_password: str):
        if (
            cache_client.counter(
                f"{CACHE_NAMESPACE_RATELIMIT_DELETE_IP}:{ip_addr}",
                REPLAY_RATE_DELETE_WINDOW_SEC,
            )
            > REPLAY_RATE_DELETE_MAX_REQUEST
        ):
            return {"state": "rate_limit_exceeded"}
        result_sql = SQLReplays.delete_replay(
            replay_id=replay_id, raw_delete_password=raw_delete_password
        )
        cache_client.delete_prefix_list("*", "cache")
        return result_sql


class AdminUsecase:
    @staticmethod
    def reanalyze_replay(replay_id: int):
        # 新作等、取り急ぎ平文をパースするようにしたが後々リプレイ構造が解明し
        # リプレイのメタデータを差し替える必要が出てきた場合に使用する
        # 恐らく設計の都合上ゲームIDだけはそのリプレイは正しいとすることになるだろう。
        # 現状はパース結果にパースバージョンを付けて新旧を判別し、
        # 新旧パースどちらもユーザに返すようにしている
        pass

    @staticmethod
    def delete_replay_without_pass(replay_id: int):
        SQLReplays.delete_replay_without_pass(replay_id=replay_id)
        cache_client.delete_prefix_list("*", "cache")

    @staticmethod
    def delete_replays_until(uploaded_until: datetime):
        SQLReplays.delete_replay_until(uploaded_until=uploaded_until)
        cache_client.delete_prefix_list("*", "cache")

    @staticmethod
    def integrity_sync():
        SQLReplays.integrity_sync()
        cache_client.delete_prefix_list("*", "cache")

    @staticmethod
    def clear_ratelimit_ip(ip_addr: str):
        cache_client.delete(f"{CACHE_NAMESPACE_RATELIMIT_POST_IP}:{ip_addr}", "counter")
