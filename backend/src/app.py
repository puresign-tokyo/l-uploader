from fastapi import FastAPI, Query, File, UploadFile, Form, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse, JSONResponse
from fastapi.responses import RedirectResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from psycopg.errors import ConnectionFailure, ConnectionTimeout

from typing import Literal
from pydantic import BaseModel, ValidationError
from enum import StrEnum
from datetime import datetime
import shutil
import utility

import logging


import io
import os

from pathlib import Path
import uvicorn

from replay import ReplayMetaData, ReplayPost
from sqls import SQLReplays

ALLOW_ORIGIN = os.getenv("ALLOW_FRONTEND_ORIGIN")
if ALLOW_ORIGIN == None:
    raise ValidationError("ALLOW_FRONTEND_ORIGINが指定されていません")
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


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("alcostg")
logger.info("Started")

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOW_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# メタデータの一覧を返す
@app.get("/replays")
def get_replays(
    sort: Literal["score", "uploaded_at", "created_at"] = "score",
    order: Literal["desc", "asc"] = "asc",
    offset: int = 1,
    limit: int = 1000,
):
    if offset < 0 or limit < 0:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if order == "asc":
        is_asc = True
    else:
        is_asc = False

    try:
        replay_posts = SQLReplays.select_replay_sorted(
            sort=sort, offset=offset, limit=limit, is_asc=is_asc
        )
    except Exception as e:
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
                    uploaded_at=replay_post.uploaded_at.isoformat(),
                    game_version=replay_post.replay_meta_data.game_version,
                    slow_rate=replay_post.replay_meta_data.slow_rate,
                    upload_comment=replay_post.upload_comment,
                )
            )
        )

    # except Exception:
    # logger.exception("リプレイメタデータ一覧の取得に失敗しました")

    # raise HTTPException(
    #     status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=""
    # )

    return returning


@app.get("/replays/{replay_id}")
def get_replays_replay_id(replay_id: int):
    try:
        replay_post = SQLReplays.select_replay(replay_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="select replay not found"
        )
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    returning_item = GetReplays(
        replay_id=replay_post.replay_id,
        replay_file_name=f"alco_ud{utility.id_to_filename(replay_post.replay_id)}.rpy",
        user_name=replay_post.user_name,
        replay_name=replay_post.replay_meta_data.replay_name,
        created_at=replay_post.replay_meta_data.created_at.isoformat(),
        stage=utility.stage_mapping[replay_post.replay_meta_data.stage],
        score="{:,}".format(replay_post.replay_meta_data.score),
        uploaded_at=replay_post.uploaded_at.isoformat(),
        game_version=replay_post.replay_meta_data.game_version,
        slow_rate=replay_post.replay_meta_data.slow_rate,
        upload_comment=replay_post.upload_comment,
    )
    return JSONResponse(content=jsonable_encoder(returning_item))


@app.get("/replays/{replay_id}/file")
def get_replays_replay_id_file(replay_id: int):
    if not (replay_dir / str(replay_id)).exists():
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
    # ReplayPostはDBから持ってくるときにパスワードを取得しない為空文字を許さなければならない。
    # よってここでパスワードのバリデーションを掛けなければいけない
    if len(delete_password) > DELETE_PASSWORD_LIMIT:
        logger.info(
            "パスワードが"
            + str(len(delete_password))
            + "文字であり、"
            + str(DELETE_PASSWORD_LIMIT)
            + "文字以上です"
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(delete_password) <= 0:
        logger.info(
            "パスワードが" + str(len(delete_password)) + "文字であり0文字以下です"
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # replay_meta_data = ReplayMetaData.new_from_file(replay_file.file)
    try:
        replay_post = ReplayPost.new_from_post(
            replay_file.file,
            user_name,
            upload_comment,
            delete_password,
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="invalid replay file",
        )
    try:
        replay_id = SQLReplays.insert_replay_meta_data(replay_post)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ReplayPost.new_from_postで最後までseekしてしまっているから
    replay_file.file.seek(0)
    with open(replay_dir / str(replay_id), "wb") as fp:
        fp.write(replay_file.file.read())

    replay_file.file.close()

    return


@app.delete("/replays/{replay_id}")
def delete_replays_replay_id(replay_id: int, body: DeleteReplays):
    try:
        SQLReplays.delete_replay(
            replay_id=replay_id,
            requested_raw_delete_password=body.delete_password,
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="password mismatch"
        )
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="requested replay not found"
        )
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
