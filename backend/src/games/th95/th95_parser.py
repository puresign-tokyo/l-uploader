from datetime import datetime
from parsers.py_code import th95
from parsers.base_parser import BaseParser
from games.th95.th95_replay_info import TH95ReplayInfo


class TH95Parser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "th95"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t95r"

    def parse(self, rep_raw: bytes):
        replay = th95.Th95.from_bytes(rep_raw)

        if replay.userdata is None:
            raise ValueError("th95 replay file cannot be parsed")

        if replay.userdata.level.value is None:
            raise ValueError("th95 replay file cannot be found level value")

        if replay.userdata.scene.value is None:
            raise ValueError("th95 replay file cannot be found scene value")

        if replay.userdata.score.value is None:
            raise ValueError("th95 replay file cannot be found total score")

        if replay.userdata.date.value is None:
            raise ValueError("th95 replay file cannot be found date")

        if replay.userdata.username.value is None:
            raise ValueError("th95 replay file cannot be found username")

        if replay.userdata.slowdown.value is None:
            raise ValueError("th95 replay file cannot be found slowdown")

        spell_level = replay.userdata.level.value

        spell_scene = int(replay.userdata.scene.value)

        return TH95ReplayInfo(
            total_score=int(replay.userdata.score.value),
            timestamp=datetime.strptime(replay.userdata.date.value, "%y/%m/%d %H:%M"),
            name=replay.userdata.username.value,
            level=spell_level,
            scene=spell_scene,
            slowdown=float(replay.userdata.slowdown.value),
        )
