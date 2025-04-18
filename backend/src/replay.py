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

SCORE_LIMIT = 10000000

# get alco replay info.
#
# param:
#     [replay-filepath]
# return:
#     array[Version, Name, Date, Score, SlowRate, Comment(coding:Shift_jis)]
#

logger = logging.getLogger("alcostg.replay")


def ensure_created_past(raw_created_at: datetime) -> datetime:
    if datetime.now() < raw_created_at:
        ValidationError(f"リプレイ作成時刻が現在時刻よりも前です。")
    return raw_created_at


def ensure_stage_value(raw_stage: str) -> str:
    if raw_stage not in ["1", "1 〜 2", "1 〜 3", "All Clear"]:
        print(raw_stage)
        ValidationError("到達ステージの値がありえない値です")
    return raw_stage


def ensure_score_range(raw_score: int) -> int:
    score = int(raw_score)
    if score < 0:
        ValidationError("scoreが0未満です")
    if SCORE_LIMIT < score:
        ValidationError("scoreの値が{SCORE_LIMIT}を超えています")
    return score


def ensure_slow_rate_range(raw_slow_rate: float) -> float:
    if raw_slow_rate < 0.0:
        ValidationError("処理落ち率が0未満です")
    if 1.0 < raw_slow_rate:
        ValidationError("処理落ち率が1を越えています")
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
            raise ValidationError(
                "リプレイ情報のキーの読み取り中にエラーが発生しました"
            )

        return str_line[1].rstrip("\r\n")

    @staticmethod
    def new_from_file(fp: BinaryIO) -> "ReplayMetaData":
        # 読み込み処理

        try:
            # with open(filepath, "rb") as fp:

            # read magic number
            buf = fp.read(4)
            # replay format check
            if buf != b"al1r":
                raise ValidationError(
                    "リプレイファイルのマジックナンバーが合致しません"
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
        except ValueError as e:
            logger.exception(e)
            raise ValidationError("リプレイファイルのパースに失敗しました")

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


class ReplayPost(BaseModel):
    replay_id: int = NOT_IDENTIFYED
    user_name: str = ""
    upload_comment: str = ""
    uploaded_at: datetime = datetime.fromtimestamp(0)
    delete_password: str = ""
    replay_meta_data: ReplayMetaData

    @staticmethod
    def new_from_post(
        fp: BinaryIO, user_name: str, upload_comment: str, delete_password: str
    ) -> "ReplayPost":
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
        delete_password: str,
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
            delete_password=delete_password,
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
