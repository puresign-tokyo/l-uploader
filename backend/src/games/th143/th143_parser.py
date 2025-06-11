from datetime import datetime, timezone
import math
from parsers.py_code import th143, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th143.th143_replay_info import TH143ReplayInfo


class TH143Parser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "th143"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t143"

    def parse(self, rep_raw: bytes):
        replay = th143.Th143.from_bytes(rep_raw)

        if replay.userdata is None:
            raise ValueError("th143 replay file cannot be parsed")

        if replay.userdata.name.value is None:
            raise ValueError("th143 replay file cannot be found name value")

        if replay.userdata.level.value is None:
            raise ValueError("th143 replay file cannot be found level value")

        if replay.userdata.scene.value is None:
            raise ValueError("th143 replay file cannot be found scene value")

        if replay.userdata.score.value is None:
            raise ValueError("th143 replay file cannot be found score value")

        if replay.userdata.date.value is None:
            raise ValueError("th143 replay file cannot be found date value")

        if replay.userdata.slowdown.value is None:
            raise ValueError("th143 replay file cannot be found slowdown value")

        return TH143ReplayInfo(
            total_score=int(replay.userdata.score.value),
            timestamp=datetime.strptime(replay.userdata.date.value, "%y/%m/%d %H:%M"),
            name=replay.userdata.name.value,
            level=int(replay.userdata.level.value),
            scene=int(replay.userdata.scene.value),
            slow_down=float(replay.userdata.slowdown.value),
        )
