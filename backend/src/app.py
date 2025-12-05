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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler

from typing import Literal
from pydantic import BaseModel, ValidationError
from enum import StrEnum
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from getenv import getenv_secure, get_env_secure_bool

import logging
import log.log_manager as log_manager
from log.client_ip import client_ip_context


import io
import re

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
from games.th20.th20_parser import TH20Parser
from games.th95.th95_parser import TH95Parser
from games.th125.th125_parser import TH125Parser
from games.th128.th128_parser import TH128Parser
from games.th143.th143_parser import TH143Parser
from games.th165.th165_parser import TH165Parser
from games.alco.alco_parser import AlcoParser


from game_registry import GameRegistry

from usecase import Usecase, AdminUsecase

ALLOW_ORIGIN = getenv_secure("ALLOW_FRONTEND_ORIGIN")


USERNAME_LENGTH_LIMIT = int(getenv_secure("USERNAME_LENGTH_LIMIT"))
UPLOAD_COMMENT_LENGTH_LIMIT = int(getenv_secure("UPLOAD_COMMENT_LENGTH_LIMIT"))
FILESIZE_KB_LIMIT = int(getenv_secure("FILESIZE_KB_LIMIT"))
DELETE_PASSWORD_LENGTH_LIMIT = int(getenv_secure("DELETE_PASSWORD_LENGTH_LIMIT"))
OPTIONAL_TAG_LENGTH_LIMIT = int(getenv_secure("OPTIONAL_TAG_LENGTH_LIMIT"))
MAX_PAGINATION_PAGES = int(getenv_secure("MAX_PAGINATION_PAGES"))

FETCH_REPLAY_LIMIT = 1000


replay_dir = Path("/home/app/replays")


class Stage(StrEnum):
    stage_1 = "Stage1"
    stage_2 = "Stage2"
    stage_3 = "Stage3"
    all_clear = "ALL"


class DeleteReplays(BaseModel):
    delete_password: str
    recaptcha_token: str


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

ASCII_VISIBLE_RE = re.compile(r"^[\x20-\x7E]*$")


def request_detail(request: Request):
    query_params = request.query_params
    if not query_params:
        return f"{request.method} {request.url.path}"
    return f"{request.method} {request.url.path}&{request.query_params}"


def direct_client_ip(request: Request):
    if request.client is None:
        logger.error("request.client is None")
        return None
    return request.client.host


def header_client_ip(request: Request, header_name: str):
    client_ip = request.headers.get(header_name)
    if client_ip is None:
        logger.error(f"{header_name} header is not found.")
    return client_ip


def get_client_ip(request: Request):
    if request.client is not None and (
        request.client.host == "127.0.0.1" or request.client.host == "localhost"
    ):
        return "localhost"

    if get_env_secure_bool("USE_REVERSE_PROXY") != True:
        return direct_client_ip(request)

    if get_env_secure_bool("USE_CLOUDFLARE_PROXY") == True:
        header_name = "CF-Connecting-IP"
    else:
        header_name = "X-Forwarded-For"

    return header_client_ip(request, header_name)


@app.middleware("http")
async def set_ip_context(request: Request, call_next):
    if (client_ip := get_client_ip(request)) is None:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
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
    page: int = -1,
):
    if game_id != "all" and game_id not in GameRegistry.supported_game_ids():
        logger.info(f"Received replay request with invalid game_id: {game_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if page < -1:
        logger.info(
            f"Invalid page: negative value {page} is not allowed. only -1 is allowed in negative value."
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if page > MAX_PAGINATION_PAGES:
        logger.info(
            f"Invalid page: received {page}, but maximum allowed is {MAX_PAGINATION_PAGES}."
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    try:
        result = Usecase.select_replays(
            game_id=game_id,
            category=category,
            optional_tag=optional_tag,
            order=order,
            page=page,
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JSONResponse(content=result)


@app.get("/replays/count")
def count_replays(
    game_id: str = "all",
    category: Literal[
        "all", "score_run", "no_bomb", "no_miss", "clear", "others"
    ] = "all",
    optional_tag: str = "",
    uploaded_date_since: datetime = Query(
        default=datetime(1970, 1, 1, tzinfo=ZoneInfo("Asia/Tokyo"))
    ),
    uploaded_date_until: datetime = Query(default=datetime.now(ZoneInfo("Asia/Tokyo"))),
):
    if game_id != "all" and game_id not in GameRegistry.supported_game_ids():
        logger.info(f"Received replay request with invalid game_id: {game_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    try:
        result = Usecase.count_replays(game_id, category, optional_tag)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JSONResponse(content={"count": result["count"]})


@app.get("/replays/{replay_id}")
def get_replays_replay_id(request: Request, replay_id: int):

    try:
        result = Usecase.select_replay(replay_id)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if result["state"] == "replay_not_found_in_postgres":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="selected replay is not found"
        )
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
    request: Request,
    replay_file: UploadFile,
    user_name=Form(),
    upload_comment=Form(),
    delete_password=Form(),
    category: Literal["score_run", "no_bomb", "no_miss", "clear", "others"] = Form(
        "others"
    ),
    optional_tag=Form(),
    recaptcha_token=Form(),
):
    if (client_ip := get_client_ip(request)) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="validation error",
        )
    if len(user_name) > USERNAME_LENGTH_LIMIT:
        logger.exception(
            f"user_name length exceeds the maximum allowed characters. user_name: {user_name},  Length: {len(user_name)}, limit: {USERNAME_LENGTH_LIMIT}. Upload rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_name length exceeds the maximum allowed characters",
        )

    if len(upload_comment) > UPLOAD_COMMENT_LENGTH_LIMIT:
        logger.exception(
            f"upload_comment length exceeds the maximum allowed characters. upload_comment: {upload_comment},  Length: {len(upload_comment)}, limit: {UPLOAD_COMMENT_LENGTH_LIMIT}. Upload rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="upload_comment length exceeds the maximum allowed characters",
        )

    if len(optional_tag) > OPTIONAL_TAG_LENGTH_LIMIT:
        logger.exception(
            f"optional_tag length exceeds the maximum allowed characters. optional_tag: {optional_tag},  Length: {len(optional_tag)}, limit: {OPTIONAL_TAG_LENGTH_LIMIT}. Upload rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="optional_tag length exceeds the maximum allowed characters",
        )

    if len(delete_password) > DELETE_PASSWORD_LENGTH_LIMIT:
        logger.exception(
            f"Delete password length exceeds the maximum allowed characters. Length: {len(delete_password)}, limit: {DELETE_PASSWORD_LENGTH_LIMIT}. Upload rejected."
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
    if len(delete_password.strip()) == 0:
        logger.info("Delete password is made with only space characters.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password is made with only space characters.",
        )

    if not ASCII_VISIBLE_RE.fullmatch(delete_password):
        logger.info("Delete password includes non-visible ascii characters.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password includes non-visible ascii characters.",
        )

    rep_raw = replay_file.file.read()
    replay_file.file.close()
    if (replay_file_length := len(rep_raw)) > FILESIZE_KB_LIMIT * 1024:
        logger.info(
            f"Replay file is too large (received {replay_file_length} bytes / {replay_file_length/1024} KB, limit is {FILESIZE_KB_LIMIT*1024} bytes / {FILESIZE_KB_LIMIT} KB.)"
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="")

    try:
        result = Usecase.post_replay(
            ip_addr=client_ip,
            rep_raw=rep_raw,
            user_name=user_name,
            category=category,
            optional_tag=optional_tag,
            upload_comment=upload_comment,
            uploaded_at=datetime.now(ZoneInfo("Asia/Tokyo")),
            raw_delete_password=delete_password,
            recaptcha_token=recaptcha_token,
        )
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if result["state"] == "recaptcha_failed":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="did not authorized recaptcha",
        )

    if result["state"] == "duplicate":
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"replay_id": result["replay_id"]},
        )

    if result["state"] == "rate_limit_exceeded":
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS)

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"replay_id": result["replay_id"]}
    )


@app.delete("/replays/{replay_id}")
def delete_replays_replay_id(request: Request, replay_id: int, body: DeleteReplays):
    if len(body.delete_password) > DELETE_PASSWORD_LENGTH_LIMIT:
        logger.exception(
            f"Delete password length exceeds the maximum allowed characters. Length: {len(body.delete_password)}, limit: {DELETE_PASSWORD_LENGTH_LIMIT}. Upload rejected."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password length exceeds the maximum allowed characters",
        )
    if len(body.delete_password) <= 0:
        logger.info(
            "Delete password is empty. A non-empty password is required for replay deletion authentication."
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password is empty. A non-empty password is required for replay deletion authentication.",
        )
    if len(body.delete_password.strip()) == 0:
        logger.info("Delete password is made with only space characters.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password is made with only space characters.",
        )

    if not ASCII_VISIBLE_RE.fullmatch(body.delete_password):
        logger.info("Delete password includes non-visible ascii characters.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delete password includes non-visible ascii characters.",
        )
    if (client_ip := get_client_ip(request)) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="validation error",
        )
    try:
        result = Usecase.delete_replay(
            client_ip,
            replay_id=replay_id,
            raw_delete_password=body.delete_password,
            recaptcha_token=body.recaptcha_token,
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

    if result["state"] == "rate_limit_exceeded":
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS)

    if result["state"] == "recaptcha_failed":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="did not authorized recaptcha",
        )

    return


@app.post("/internal/integrity_sync")
def integrity_sync():
    AdminUsecase.integrity_sync()


@app.delete("/internal/cache/ratelimit_ip")
def delete_cache_ratelimit_ip(ip_addr: str):
    AdminUsecase.clear_ratelimit_ip(ip_addr)


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
        detail="I can't serve you alcohol, because I am a little teapot. But I can pour you some Returner Liqueur instead.",
    )


@app.get("/returner")
def get_returner():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "name": "Returner Liqueur",
            "type": "tea liqueur",
            "abv": "24%",
            "note": "A smooth black tea spirit served only by little teapots.",
        },
    )


if __name__ == "__main__":
    uvicorn.run(app="app:app", host="0.0.0.0", port=5001, reload=True)
