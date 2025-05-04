from fastapi import (
    FastAPI,
    Query,
    File,
    UploadFile,
    Form,
    HTTPException,
    status,
    Request,
)
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse, JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler

from psycopg.errors import ConnectionFailure, ConnectionTimeout

from typing import Literal
from pydantic import BaseModel, ValidationError
from enum import StrEnum
from datetime import datetime
import shutil
import utility

import logging
import log.log_manager as log_manager
from log.client_ip import client_ip_context


import io
import os

from pathlib import Path
import uvicorn

from replay import ReplayMetaData, ReplayPost
from sqls import SQLReplays

ALLOW_ORIGIN = os.getenv("ALLOW_FRONTEND_ORIGIN")
if ALLOW_ORIGIN == None:
    raise ValidationError("not set ALLOW_FRONTEND_ORIGIN")
DELETE_PASSWORD_LIMIT = 60

host_dir = Path(__file__).parent
css_dir = host_dir / "css"
replay_dir = Path("/replays")


class Stage(StrEnum):
    stage_1 = "Stage1"
    stage_2 = "Stage2"
    stage_3 = "Stage3"
    all_clear = "ALL"


class DeleteReplays(BaseModel):
    delete_password: str


class PostReplays(BaseModel):
    user_name: str
    encrypted_password: str
    upload_comment: str


class GetReplays(BaseModel):
    replay_id: int
    replay_file_name: str  # 数値形式である replay_id を alco_{replay_id}.rpyとして返す。0埋めせずそのまま埋め込む
    user_name: str
    replay_name: str
    created_at: str  # ISOフォーマットにする
    stage: str
    score: str  # 3桁ずつカンマを入れる
    uploaded_at: str  # ISOフォーマットにする
    game_version: str
    slow_rate: float
    upload_comment: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOW_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log_manager.init_logger_alcostg(logging.DEBUG)
logger = log_manager.get_logger()


def request_detail(request: Request):
    query_params = request.query_params
    if not query_params:
        return f"{request.method} {request.url.path}"
    return f"{request.method} {request.url.path}&{request.query_params}"


@app.middleware("http")
async def set_ip_context(request: Request, call_next):

    if os.getenv("USE_REVERSE_PROXY") != "True":
        client_ip_context.set("NoProxy")
    elif (client_ip := request.headers.get("X-Forwarded-For")) == None:
        client_ip_context.set("")
        logger.error("did not use reverse proxy")
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail": "Forbidden: validation failed"},
        )
    else:
        client_ip_context.set(client_ip)

    logger.info(msg=f"Start Request: {request_detail(request)}")
    response = await call_next(request)
    logger.info(msg=f"End Request: {request_detail(request)}")
    return response


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(
        f"HTTPException: {exc.status_code} {exc.detail}: {request_detail(request)}"
    )
    return await http_exception_handler(request, exc)


# メタデータの一覧を返す
@app.get("/replays")
def get_replays(
    request: Request,
    sort: Literal["score", "uploaded_at", "created_at"] = "score",
    order: Literal["desc", "asc"] = "asc",
    offset: int = 1,
    limit: int = 1000,
):

    if offset < 0:
        logger.error(
            f"Invalid offset value received: {offset}. Offset must be a non-negative integer. Request rejected."
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if limit < 0:
        logger.error(
            f"Invalid limit value received: {limit}. Limit must be a positive integer greater than zero. Request rejected."
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if order == "asc":
        is_asc = True
    else:
        is_asc = False

    try:
        replay_posts = SQLReplays.select_replay_sorted(
            sort=sort, offset=offset, limit=limit, is_asc=is_asc
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    returning = []

    for replay_post in replay_posts:
        returning.append(
            jsonable_encoder(
                GetReplays(
                    replay_id=replay_post.replay_id,
                    replay_file_name=f"alco_ud{utility.id_to_filename(replay_post.replay_id)}.rpy",
                    user_name=replay_post.user_name,
                    replay_name=replay_post.replay_meta_data.replay_name,
                    created_at=replay_post.replay_meta_data.created_at.isoformat(),
                    stage=utility.stage_mapping[replay_post.replay_meta_data.stage],
                    score="{:,}".format(replay_post.replay_meta_data.score),
                    uploaded_at=replay_post.uploaded_at.isoformat() + "Z",
                    game_version=replay_post.replay_meta_data.game_version,
                    slow_rate=replay_post.replay_meta_data.slow_rate,
                    upload_comment=replay_post.upload_comment,
                )
            )
        )

    return returning


@app.get("/replays/{replay_id}")
def get_replays_replay_id(request: Request, replay_id: int):

    if (client_ip := request.headers.get("X-Forwarded-For")) == None:
        logger.info("did not use reverse proxy. Bye.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    try:
        replay_post = SQLReplays.select_replay(replay_id)
    except ValueError as e:
        logger.exception(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="select replay not found"
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    returning_item = GetReplays(
        replay_id=replay_post.replay_id,
        replay_file_name=f"alco_ud{utility.id_to_filename(replay_post.replay_id)}.rpy",
        user_name=replay_post.user_name,
        replay_name=replay_post.replay_meta_data.replay_name,
        created_at=replay_post.replay_meta_data.created_at.isoformat(),
        stage=utility.stage_mapping[replay_post.replay_meta_data.stage],
        score="{:,}".format(replay_post.replay_meta_data.score),
        uploaded_at=replay_post.uploaded_at.isoformat() + "Z",
        game_version=replay_post.replay_meta_data.game_version,
        slow_rate=replay_post.replay_meta_data.slow_rate,
        upload_comment=replay_post.upload_comment,
    )

    return JSONResponse(content=jsonable_encoder(returning_item))


@app.get("/replays/{replay_id}/file")
def get_replays_replay_id_file(replay_id: int):
    if not (replay_dir / str(replay_id)).exists():
        logger.error(f"No replay found for downloading: replay_id={replay_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="replay file not Found"
        )

    return FileResponse(
        (replay_dir / str(replay_id)),
        filename=f"alco_ud{utility.id_to_filename(replay_id)}.rpy",
    )


@app.post("/replays")
def post_replays(
    replay_file: UploadFile,
    user_name=Form(),
    upload_comment=Form(),
    delete_password=Form(),
):
    # ReplayPostはDBから持きにパスワードを取得しない為空文字を許さなければならない。
    # よってここでパスワードのバリデーションを掛けなければいけない
    if len(delete_password) > DELETE_PASSWORD_LIMIT:
        logger.exception(
            f"Delete password length exceeds the maximum allowed characters. Length: {len(delete_password)}, limit: {DELETE_PASSWORD_LIMIT}. Upload rejected."
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(delete_password) <= 0:
        logger.info(
            "Delete password is empty. A non-empty password is required for replay deletion authentication."
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        # このreplay_postはreplay_idのみ入っていない(DBに登録して始めてreplay_idが付与される為)
        replay_post = ReplayPost.new_from_post(
            replay_file.file,
            user_name,
            upload_comment,
            delete_password,
        )
    except ValueError as e:
        logger.exception(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        replay_id = SQLReplays.insert_replay_meta_data(replay_post)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ReplayPost.new_from_postで最後までseekしてしまっているから
    replay_file.file.seek(0)
    with open(replay_dir / str(replay_id), "wb") as fp:
        fp.write(replay_file.file.read())

    replay_file.file.close()

    returning_item = GetReplays(
        replay_id=replay_id,
        replay_file_name=f"alco_ud{utility.id_to_filename(replay_id)}.rpy",
        user_name=replay_post.user_name,
        replay_name=replay_post.replay_meta_data.replay_name,
        created_at=replay_post.replay_meta_data.created_at.isoformat(),
        stage=utility.stage_mapping[replay_post.replay_meta_data.stage],
        score="{:,}".format(replay_post.replay_meta_data.score),
        uploaded_at=replay_post.uploaded_at.isoformat() + "Z",
        game_version=replay_post.replay_meta_data.game_version,
        slow_rate=replay_post.replay_meta_data.slow_rate,
        upload_comment=replay_post.upload_comment,
    )

    return returning_item


@app.delete("/replays/{replay_id}")
def delete_replays_replay_id(replay_id: int, body: DeleteReplays):
    try:
        SQLReplays.delete_replay(
            replay_id=replay_id,
            requested_raw_delete_password=body.delete_password,
        )
    except ValueError as e:
        logger.exception(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="password mismatch"
        )
    except KeyError as e:
        logger.exception(e)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="requested replay not found"
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    os.remove(replay_dir / str(replay_id))
    return


@app.get("/cocktail")
def get_cocktail():
    return RedirectResponse("/teapot")


@app.get("/wine")
def get_wine():
    return RedirectResponse("/teapot")


@app.get("/sake")
def get_sake():
    return RedirectResponse("/teapot")


@app.get("/beer")
def get_beer():
    return RedirectResponse("/teapot")


@app.get("/alcohol")
def get_alcohol():
    return RedirectResponse("/teapot")


@app.get("/teapot")
def get_teapot():
    raise HTTPException(
        status_code=status.HTTP_418_IM_A_TEAPOT,
        detail="I can't give you alcohol, because I am a little teapot.",
    )


if __name__ == "__main__":
    uvicorn.run(app="app:app", host="0.0.0.0", port=5001, reload=True)
