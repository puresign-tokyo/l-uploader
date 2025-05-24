from datetime import datetime, timezone
import math
from parsers.py_code import th125, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th125.th125_replay_info import TH125ReplayInfo


class TH125Parser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "th125"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t125"

    def parse(self, rep_raw: bytes):
        replay = th125.Th125.from_bytes(rep_raw)

        if replay.userdata is None:
            raise ValueError("th125 replay file cannot be parsed")

        if replay.userdata.name.value is None:
            raise ValueError("th125 replay file cannot be found level value")

        if replay.userdata.level is None:
            raise ValueError("th125 replay file cannot be found level value")

        if replay.userdata.scene is None:
            raise ValueError("th125 replay file cannot be found scene value")

        if replay.userdata.score.value is None:
            raise ValueError("th125 replay file cannot be found total score")

        if replay.userdata.date.value is None:
            raise ValueError("th125 replay file cannot be found date")

        if replay.userdata.shot.value is None:
            raise ValueError("th125 replay file cannot be found username")

        if replay.userdata.slowdown.value is None:
            raise ValueError("th125 replay file cannot be found slowdown")

        spell_level = int(replay.userdata.level)
        spell_scene = int(replay.userdata.scene.value)

        return TH125ReplayInfo(
            total_score=int(replay.userdata.score.value),
            shot_type=replay.userdata.shot.value,
            timestamp=datetime.strptime(replay.userdata.date.value, "%y/%m/%d %H:%M"),
            name=replay.userdata.name.value,
            level=spell_level,
            scene=spell_scene,
            slowdown=float(replay.userdata.slowdown.value),
        )
