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
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import shutil
import utility

import logging
import log.log_manager as log_manager
from log.client_ip import client_ip_context


import io
import os

from pathlib import Path
import uvicorn


# TODO いつか個々の作品を import するのをなくしたい
from games.th06.th06_parser import TH06Parser
from games.th07.th07_parser import TH07Parser
from games.th08.th08_parser import TH08Parser
from games.th09.th09_parser import TH09Parser
from games.th10.th10_parser import TH10Parser
from games.th11.th11_parser import TH11Parser
from games.th12.th12_parser import TH12Parser
from games.th13.th13_parser import TH13Parser
from games.th14.th14_parser import TH14Parser
from games.th15.th15_parser import TH15Parser
from games.th16.th16_parser import TH16Parser
from games.th17.th17_parser import TH17Parser
from games.th18.th18_parser import TH18Parser
from games.th95.th95_parser import TH95Parser
from games.th125.th125_parser import TH125Parser
from games.th128.th128_parser import TH128Parser
from games.th143.th143_parser import TH143Parser
from games.th165.th165_parser import TH165Parser
from games.alco.alco_parser import AlcoParser


from game_registry import GameRegistry

from usecase import Usecase, AdminUsecase

ALLOW_ORIGIN = os.getenv("ALLOW_FRONTEND_ORIGIN")
if ALLOW_ORIGIN == None:
    raise ValidationError("not set ALLOW_FRONTEND_ORIGIN")
FETCH_REPLAY_LIMIT = 1000
DELETE_PASSWORD_LIMIT = 60
MAX_REPLAY_SIZE = 200 * 1024


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

log_manager.init_logger_alcostg(logging.INFO)
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
    game_id: str = "all",
    category: Literal[
        "all", "score_run", "no_bomb", "no_miss", "clear", "others"
    ] = "all",
    optional_tag: str = "",
    order: Literal["desc", "asc"] = "asc",
    upload_date_since: datetime = Query(
        default=datetime(1970, 1, 1, tzinfo=ZoneInfo("Asia/Tokyo"))
    ),
    upload_date_until: datetime = Query(default=datetime.now(ZoneInfo("Asia/Tokyo"))),
    offset: int = 0,
    limit: int = 1000,
):
    if game_id != "all" and game_id not in GameRegistry.supported_game_ids():
        logger.info(f"Received replay request with invalid game_id: {game_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if offset < 0:
        logger.info(f"Invalid offset: negative value {offset} is not allowed.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if limit < 0:
        logger.info(f"Invalid limit parameter: negative value {limit} is not allowed.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if limit > FETCH_REPLAY_LIMIT:
        logger.info(
            f"Invalid limit parameter: received {limit}, but maximum allowed is {FETCH_REPLAY_LIMIT}."
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    try:
        result = Usecase.select_replays(
            upload_date_since=upload_date_since,
            upload_date_until=upload_date_until,
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JSONResponse(content=result)


@app.get("/replays/{replay_id}")
def get_replays_replay_id(request: Request, replay_id: int):

    try:
        result = Usecase.select_replay(replay_id)
        if result["state"] == "replay_not_found_in_postgres":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="select replay not found"
        )
    print(result["post"])
    return JSONResponse(content=result["post"])


@app.get("/replays/{replay_id}/file")
def get_replays_replay_id_file(replay_id: int):
    try:
        result = Usecase.download_replay(replay_id)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if result["state"] == "replay_not_found_in_postgres":
        logger.info(f"replay_id {replay_id} is not found in postgres")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="replay is not found"
        )

    if result["state"] == "replay_not_found_in_directory":
        logger.info(f"replay_id {replay_id} is not found in directory")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="replay is not found"
        )

    return FileResponse(
        result["path"],
        filename=result["filename"],
    )


@app.post("/replays")
def post_replays(
    replay_file: UploadFile,
    user_name=Form(),
    upload_comment=Form(),
    delete_password=Form(),
    category: Literal["score_run", "no_bomb", "no_miss", "clear", "others"] = Form(
        "others"
    ),
    optional_tag=Form(),
):
    # ReplayPostはDBから持きにパスワードを取得しない為空文字を許さなければならない。
    # よってここでパスワードのバリデーションを掛けなければいけない
    if len(delete_password) > DELETE_PASSWORD_LIMIT:
        logger.exception(
            f"Delete password length exceeds the maximum allowed characters. Length: {len(delete_password)}, limit: {DELETE_PASSWORD_LIMIT}. Upload rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password length exceeds the maximum allowed characters",
        )
    if len(delete_password) <= 0:
        logger.info(
            "Delete password is empty. A non-empty password is required for replay deletion authentication."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password is empty. A non-empty password is required for replay deletion authentication.",
        )

    rep_raw = replay_file.file.read()
    replay_file.file.close()
    if (replay_file_length := len(rep_raw)) > MAX_REPLAY_SIZE:
        logger.info(
            f"Replay file is too large (received {replay_file_length} bytes / {replay_file_length/1024} KB, limit is {MAX_REPLAY_SIZE} bytes / {MAX_REPLAY_SIZE/1024} KB.)"
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="")

    try:
        result = Usecase.post_replay(
            rep_raw,
            user_name=user_name,
            category=category,
            optional_tag=optional_tag,
            upload_comment=upload_comment,
            uploaded_at=datetime.now(ZoneInfo("Asia/Tokyo")),
            raw_delete_password=delete_password,
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if result["state"] == "duplicate":
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"replay_id": result["replay_id"]},
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"replay_id": result["replay_id"]}
    )


@app.delete("/replays/{replay_id}")
def delete_replays_replay_id(replay_id: int, body: DeleteReplays):
    try:
        result = Usecase.delete_replay(
            replay_id=replay_id, raw_delete_password=body.delete_password
        )

    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if result["state"] == "invalid_password":
        logger.info(
            f"Replay deletion denied: Invalid password for replay_id={replay_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="password mismatch"
        )

    if result["state"] == "replay_not_found_postgres":
        logger.info(f"Delete request received for non-existent replay_id={replay_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="replay not found"
        )

    return


@app.post("/internal/integrity_sync")
def integrity_sync():
    AdminUsecase.integrity_sync()


@app.delete("/internal/replays/{replay_id}")
def delete_replay_without_pass(replay_id: int):
    AdminUsecase.delete_replay_without_pass(replay_id=replay_id)


@app.delete("/internal/replays")
def delete_replays_until(
    uploaded_until: datetime = Query(
        default=datetime.now(ZoneInfo("Asia/Tokyo")) - timedelta(days=365)
    ),
):
    AdminUsecase.delete_replays_until(uploaded_until=uploaded_until)


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
