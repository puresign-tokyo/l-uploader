from fastapi import FastAPI, Query, File, UploadFile, Form, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse, Response
from fastapi.responses import RedirectResponse

from typing import Literal
from pydantic import BaseModel
from enum import StrEnum
from datetime import datetime as dt


import logging


import io

from pathlib import Path
import uvicorn

from replay import ReplayMetaData
from sqls import SQLReplays

host_dir = Path(__file__).parent
css_dir = host_dir / "css"
replay_dir = Path("/replays")


class Stage(StrEnum):
    stage_1 = "Stage1"
    stage_2 = "Stage2"
    stage_3 = "Stage3"
    all_clear = "ALL"


class DeleteReplays(BaseModel):
    encrypted_password: str


class PostReplays(BaseModel):
    user_name: str
    encrypted_password: str
    upload_comment: str


class Replay(BaseModel):
    replay_id: str
    user_name: str
    created_at: dt
    stage: Stage
    score: int
    uploaded_at: dt
    game_version: str
    slow_late: float
    encrypted_password: str


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("alcostg")
logger.info("Started")

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def get_root():
    return RedirectResponse("/index.html")


@app.get("/index.html", response_class=HTMLResponse)
def get_index():
    return FileResponse(host_dir / "index.html")


# メタデータの一覧を返す
@app.get("/replays")
def get_replays(
    sort: Literal["score", "uploaded_at", "created_at"] = "score",
    order: Literal["desc", "asc"] = "asc",
):
    try:
        conn = psycopg.connect()
        # conn.execute()

    except Exception:
        logger.exception("リプレイメタデータ一覧の取得に失敗しました")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=""
        )

    return ""


@app.get("/replays/{replay_id}")
def get_replays_replay_id():
    return ""


@app.get("/replays/{replay_id}/file")
def get_replays_replay_id_file(replay_id: str):
    if not (replay_dir / replay_id).exists():
        return HTTPException(detail="File not Found", status_code=404)

    return FileResponse((replay_dir / replay_id), filename="alco_{replay_id}.rpy")


@app.post("/replays")
def post_replays(replay_file: UploadFile, body: PostReplays):
    replay_meta_data = ReplayMetaData.new_from_file(replay_file.file)
    replay_file.file.close()
    SQLReplays.insert_replay_meta_data(
        replay_meta_data,
        body.user_name,
        body.upload_comment,
        body.encrypted_password,
    )

    return ""


@app.delete("/replays/{replays_id}")
def delete_replays_replay_id(replay_id: str, body: DeleteReplays):
    return ""


@app.get("/teapot")
def teapot():
    raise HTTPException(status_code=status.HTTP_418_IM_A_TEAPOT)


if __name__ == "__main__":
    uvicorn.run(app="app:app", host="0.0.0.0", port=5001, reload=True)
