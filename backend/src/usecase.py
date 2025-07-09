import http_requester as http_requester
from log import log_manager
from postgres_handler import SQLReplays
from datetime import date
from postgres_handler import SQLReplays
from file_handler import FileHandler
from game_registry import GameRegistry
from datetime import datetime, date
from hashlib import sha256
import utility
import os
from common_util import getenv_secure

logger = log_manager.get_logger()

POSTS_PER_PAGE = int(getenv_secure("POSTS_PER_PAGE"))
MAX_PAGINATION_PAGES = int(getenv_secure("MAX_PAGINATION_PAGES"))

RECAPTCHA_ENABLED = getenv_secure("RECAPTCHA_ENABLED")

if RECAPTCHA_ENABLED == "True":
    RECAPTCHA_ENABLED = True
elif RECAPTCHA_ENABLED == "False":
    RECAPTCHA_ENABLED = False
else:
    raise ValueError(
        f"RECAPTCHA_ENABLED is not True or False, value is {RECAPTCHA_ENABLED}"
    )


class Usecase:

    @staticmethod
    def post_replay(
        rep_raw: bytes,
        user_name: str,
        category: str,
        optional_tag: str,
        upload_comment: str,
        uploaded_at: datetime,
        raw_delete_password: str,
        recaptcha_token: str,
    ):

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

        return result_sql

    @staticmethod
    def select_replays(
        upload_date_since: date,
        upload_date_until: date,
        game_id: str,
        category: str,
        optional_tag: str,
        order: str,
        page: int,
    ):

        if page == -1:
            offset = 0
            limit = POSTS_PER_PAGE * MAX_PAGINATION_PAGES
        else:
            offset = page * POSTS_PER_PAGE
            limit = POSTS_PER_PAGE

        result = SQLReplays.select_replay_sorted(
            uploaded_date_since=upload_date_since,
            uploaded_date_until=upload_date_until,
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
            order=order,
            offset=offset,
            limit=limit,
        )

        for post in result["posts"]:
            post["filename"] = (
                f"{post["game_id"]}_ud{utility.id_to_filename(post["replay_id"])}.rpy"
            )

        return result["posts"]

    @staticmethod
    def count_replays(
        game_id: str,
        category: str,
        optional_tag: str,
        uploaded_date_since: datetime,
        uploaded_date_until: datetime,
    ) -> dict:
        return SQLReplays.count_replays(
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
            uploaded_date_since=uploaded_date_since,
            uploaded_date_until=uploaded_date_until,
        )

    @staticmethod
    def select_replay(replay_id: int):
        result = SQLReplays.select_replay(replay_id)
        if result["state"] != "success":
            return result
        result["post"][
            "filename"
        ] = f"{result["post"]["game_id"]}_ud{utility.id_to_filename(result["post"]["replay_id"])}.rpy"
        return result

    @staticmethod
    def download_replay(replay_id: int):
        result_sql = SQLReplays.select_replay_game_id(replay_id=replay_id)
        if result_sql["state"] != "success":
            return result_sql

        # read処理なのでトランザクション外でも許される
        result_file = FileHandler.get_replay_file_path(str(replay_id))
        if result_file["state"] != "success":
            return result_file

        return {
            "state": "success",
            "path": result_file["path"],
            "filename": f"{result_sql["game_id"]}_ud{utility.id_to_filename(replay_id)}.rpy",
        }

    @staticmethod
    def delete_replay(replay_id: int, raw_delete_password: str):
        result_sql = SQLReplays.delete_replay(
            replay_id=replay_id, raw_delete_password=raw_delete_password
        )

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

    @staticmethod
    def delete_replays_until(uploaded_until: datetime):
        SQLReplays.delete_replay_until(uploaded_until=uploaded_until)

    @staticmethod
    def integrity_sync():
        SQLReplays.integrity_sync()
