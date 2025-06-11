from datetime import datetime, timezone
import math
from parsers.py_code import th165, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th165.th165_replay_info import TH165ReplayInfo


class TH165Parser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "th165"

    def can_parse(self, rep_raw: bytes) -> bool:
        # t156がマジックナンバーなことに注意
        return rep_raw[:4] == b"t156"

    def parse(self, rep_raw: bytes):
        replay = th165.Th165.from_bytes(rep_raw)

        if replay.userdata is None:
            raise ValueError("th165 replay file cannot be parsed")

        if replay.userdata.name.value is None:
            raise ValueError("th165 replay file cannot be found name value")

        if replay.userdata.level.value is None:
            raise ValueError("th165 replay file cannot be found level value")

        if replay.userdata.scene.value is None:
            raise ValueError("th165 replay file cannot be found scene value")

        if replay.userdata.date.value is None:
            raise ValueError("th165 replay file cannot be found date value")

        if replay.userdata.slowdown.value is None:
            raise ValueError("th165 replay file cannot be found slowdown value")

        # メタデータに記述されるスコアはゲーム内で管理されるスコアではないので
        # パースして取得しても意味がない
        # リプレイ構造が解析されたら parser version2 でスコアを取得したい

        return TH165ReplayInfo(
            timestamp=datetime.strptime(replay.userdata.date.value, "%y/%m/%d %H:%M"),
            name=replay.userdata.name.value,
            level=int(replay.userdata.level.value),
            scene=int(replay.userdata.scene.value),
            slow_down=float(replay.userdata.slowdown.value),
        )
