#!/bin/env python
# coding:utf-8
#
# alco replay parser module.

import os, sys, string, binascii, struct
from pydantic import BaseModel, BeforeValidator, ValidationError
from datetime import datetime
from typing import Annotated, BinaryIO
import logging

NOT_IDENTIFYED = -1

USER_NAME_LIMIT = 30
UPLOAD_COMMENT_LIMIT = 300
REPLAY_FILE_MB_LIMIT = 200
SCORE_LIMIT = 10000000

# get alco replay info.
#
# param:
#     [replay-filepath]
# return:
#     array[Version, Name, Date, Score, SlowRate, Comment(coding:Shift_jis)]
#

logger = logging.getLogger("alcostg.replay")


def megabyte_to_byte(megabyte: int):
    return megabyte * 1024


def byte_to_megabyte(byte: int):
    return byte / 1024


def ensure_created_past(raw_created_at: datetime) -> datetime:
    if (now := datetime.now()) < raw_created_at:
        ValueError(
            f"Replay creation timestamp is in the future: created_at={raw_created_at.isoformat()}, current_time={now.isoformat()}. Rejecting replay registration."
        )
    return raw_created_at


def ensure_stage_value(raw_stage: str) -> str:
    if raw_stage not in ["1", "1 〜 2", "1 〜 3", "All Clear"]:
        print(raw_stage)
        ValueError(
            f"Invalid stage reach value: '{raw_stage}' provided in replay file. Valid values are ['1', '1 〜 2', '1 〜 3', 'All Clear']. Rejecting replay registration."
        )
    return raw_stage


def ensure_score_range(raw_score: int) -> int:
    score = int(raw_score)
    if score < 0:
        ValueError(
            f"Invalid score value: {score} cannot be zero or negative. Rejecting replay registration."
        )
    if SCORE_LIMIT < score:
        ValueError(
            f"Invalid score value: {score} is too large (exceeds the maximum allowed value of {SCORE_LIMIT}). Rejecting replay registration."
        )
    return score


def ensure_slow_rate_range(raw_slow_rate: float) -> float:
    if raw_slow_rate < 0.0:
        ValueError(
            f"Invalid slow rate value: {raw_slow_rate} is less than the minimum allowed value of 0. Rejecting replay registration."
        )
    if 1.0 < raw_slow_rate:
        ValueError(
            f"Invalid slow rate value: {raw_slow_rate} exceeds the maximum allowed value of 1. Rejecting replay registration."
        )
    return raw_slow_rate


class ReplayMetaData(BaseModel):
    game_version: str = ""
    replay_name: str = ""
    # 現在時刻よりも前でなくてはならない
    created_at: Annotated[datetime, BeforeValidator(ensure_created_past)] = (
        datetime.fromtimestamp(0)
    )
    stage: Annotated[str, BeforeValidator(ensure_stage_value)] = ""
    score: Annotated[int, BeforeValidator(ensure_score_range)] = 0
    slow_rate: Annotated[float, BeforeValidator(ensure_slow_rate_range)] = 1

    @staticmethod
    def parse_value(key: str, byte_line: bytes) -> str:
        str_line = byte_line.decode("shift-jis").rsplit(key + " ", 1)
        if len(str_line) != 2:
            raise ValueError(
                f"Invalid metadata format in line: '{byte_line.decode("shift-jis")}'. Expected format is '{key}[Space]Value'. Rejecting replay registration."
            )

        return str_line[1].rstrip("\r\n")

    @staticmethod
    def new_from_file(fp: BinaryIO) -> "ReplayMetaData":
        # 読み込み処理

        # with open(filepath, "rb") as fp:

        # read magic number
        buf = fp.read(4)
        # replay format check
        if buf != b"al1r":
            raise ValueError(
                f"Invalid replay file: Magic number '{buf.decode('shift-jis')}' at the beginning of the file does not match expected value 'al1r'. Rejecting replay registration."
            )

        # read data size
        fp.read(8)

        buf = fp.read(4)
        # move to fileinfo block.
        fp.seek(struct.unpack("=L", buf)[0])

        # retrieve replay info
        # line1: USER????????リプレイファイル情報\r\n
        fp.readline()
        # line2: Version[SP]{version}\r\n
        buf = fp.readline()
        game_version = ReplayMetaData.parse_value("Version", buf)

        # line3: Name[SP]{name}\r\n        // 8文字のASCII, 前詰め, 空白埋め
        buf = fp.readline()
        replay_name = ReplayMetaData.parse_value("Name", buf)

        # line4: Date[SP]yy/mm/dd[SP]HH:MM\r\n    // 下二桁のみの管理のため2100年問題が発生する
        buf = fp.readline()
        created_at = datetime.strptime(
            "20" + ReplayMetaData.parse_value("Date", buf), "%Y/%m/%d %H:%M"
        )

        # line5: Extra|Stage[SP]{stage}\r\n        //{stage}には"1", "1～X", "All[SP]Cleaer"が入る
        buf = fp.readline()
        stage = ReplayMetaData.parse_value("Stage", buf)

        # line6: Score[SP]{score}\r\n
        buf = fp.readline()
        score = int(ReplayMetaData.parse_value("Score", buf))

        # line7: Slow[SP]Rate[SP]{rate}\r\n
        buf = fp.readline()
        slow_rate = float(ReplayMetaData.parse_value("Slow Rate", buf))

        # line8 and after:
        # \0USER????????(comment...)\0
        # read to eof. limit 1024bytes.
        # 今回はリプレイファイル内のコメントは無視するものとする
        # buf = fp.read(1024)
        # buf = strip(buf)
        # if buf[0:4] == "USER" and len(buf) >= 12:
        #     # cut USER????????
        #     retArray[6] = strip(buf[12:])

        return ReplayMetaData(
            game_version=game_version,
            replay_name=replay_name,
            created_at=created_at,
            stage=stage,
            score=score,
            slow_rate=slow_rate,
        )

    @staticmethod
    def new_from_input(
        game_version: str,
        replay_name: str,
        created_at: datetime,
        stage: str,
        score: int,
        slow_rate: float,
    ) -> "ReplayMetaData":
        return ReplayMetaData(
            game_version=game_version,
            replay_name=replay_name,
            created_at=created_at,
            stage=stage,
            score=score,
            slow_rate=slow_rate,
        )


def ensure_user_name(raw_user_name: str) -> str:
    print(raw_user_name)
    if len(raw_user_name) > USER_NAME_LIMIT:
        ValueError(
            f"User name exceeds the maximum allowed length. User name '{raw_user_name}' is too long. The maximum allowed length is {USER_NAME_LIMIT} characters. Please shorten the user name."
        )
    return raw_user_name


def ensure_upload_comment(raw_upload_comment: str) -> str:
    if len(raw_upload_comment) > UPLOAD_COMMENT_LIMIT:
        ValueError(
            f"User name exceeds the maximum allowed length. User name '{raw_upload_comment}' is too long. The maximum allowed length is {UPLOAD_COMMENT_LIMIT} characters. Please shorten the user name."
        )
    return raw_upload_comment


def get_binary_size(file: BinaryIO) -> int:
    current_pos = file.tell()  # 現在の位置を覚えておく
    file.seek(0, 2)  # ファイルの末尾へ（seek(offset, whence=2)）
    size = file.tell()  # 現在位置 = サイズ
    file.seek(current_pos)  # 元の位置に戻す
    return size


class ReplayPost(BaseModel):
    replay_id: int = NOT_IDENTIFYED
    user_name: Annotated[str, BeforeValidator(ensure_user_name)] = ""
    upload_comment: Annotated[str, BeforeValidator(ensure_upload_comment)] = ""
    uploaded_at: datetime = datetime.fromtimestamp(0)
    delete_password: str = ""
    replay_meta_data: ReplayMetaData

    @staticmethod
    def new_from_post(
        fp: BinaryIO, user_name: str, upload_comment: str, delete_password: str
    ) -> "ReplayPost":
        if get_binary_size(fp) > megabyte_to_byte(REPLAY_FILE_MB_LIMIT):
            raise ValueError(
                f"Replay file size exceeds the maximum allowed limit. Received file size: {str(byte_to_megabyte(get_binary_size(fp)))} MB, limit: {REPLAY_FILE_MB_LIMIT} MB. Upload rejected."
            )
        replay_meta_data = ReplayMetaData.new_from_file(fp)
        return ReplayPost(
            user_name=user_name,
            upload_comment=upload_comment,
            delete_password=delete_password,
            replay_meta_data=replay_meta_data,
        )

    @staticmethod
    def new_from_input(
        replay_id: int,
        user_name: str,
        replay_name: str,
        created_at: datetime,
        stage: str,
        score: int,
        uploaded_at: datetime,
        game_version: str,
        slow_rate: float,
        upload_comment: str,
    ) -> "ReplayPost":
        replay_meta_data = ReplayMetaData.new_from_input(
            game_version=game_version,
            replay_name=replay_name,
            created_at=created_at,
            stage=stage,
            score=score,
            slow_rate=slow_rate,
        )
        return ReplayPost(
            replay_id=replay_id,
            replay_meta_data=replay_meta_data,
            user_name=user_name,
            upload_comment=upload_comment,
            uploaded_at=uploaded_at,
        )


# def ALCOReplay_getReplayFileInfo(filepath):

#     # array[0:Version, 1:Name, 2:Date, 5:Stage, 6:Score,
#     # 7:SlowRate, 8:Comment]

#     replay_meta_data = ReplayMetaData()

#     buf = ""
#     dat = ""


# def strip(s):
#     s = trimNull(s)
#     s = string.strip(s)
#     return trimNull(s)


# def getValue(key, line):
#     line = strip(line)
#     if string.find(line, key) != 0:
#         return ""
#     return strip(line[len(key) :])


# def trimNull(s):
#     while True:
#         if len(s) > 0:
#             if s[-1] == "\x00":
#                 s = s[:-1]
#             elif s[0] == "\x00":
#                 s = s[1:]
#             else:
#                 break
#         else:
#             break
#     return s


def main():
    # ar = ALCOReplay_getReplayFileInfo("alco_01.rpy")
    # fp=open("alcostg_01.rpy")
    # ar = ReplayMetaData.new_from_file(fp, "良い感じの文字列あいうえお")
    # for i in range(len(ar)):
    # print(ar)
    pass


if __name__ == "__main__":
    main()


# end
