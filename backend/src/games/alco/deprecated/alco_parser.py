from datetime import datetime
from parsers.py_code import alco
from parsers.base_parser import BaseParser
from games.alco.alco_replay_info import AlcoReplayInfo


class AlcoParser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "alco"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"al1r"

    def parse(self, rep_raw: bytes):
        replay = alco.Alco.from_bytes(rep_raw)

        if replay.userdata is None:
            raise ValueError("alco replay file cannot be parsed")

        if replay.userdata.name.value is None:
            raise ValueError("alco replay file cannot be found username value")

        if replay.userdata.date.value is None:
            raise ValueError("alco replay file cannot be found date")

        if replay.userdata.stage.value is None:
            raise ValueError("alco replay file cannot be found scene value")

        if replay.userdata.score.value is None:
            raise ValueError("alco replay file cannot be found total score")

        if replay.userdata.slowdown.value is None:
            raise ValueError("alco replay file cannot be found slowdown")

        if replay.userdata.stage.value == "1":
            stage = "1"
        elif replay.userdata.stage.value == "1 〜 2":
            stage = "2"
        elif replay.userdata.stage.value == "1 〜 3":
            stage = "3"
        elif replay.userdata.stage.value == "All Clear":
            stage = "Clear"
        else:
            raise ValueError(f"Unexpected stage value {replay.userdata.stage.value}")

        return AlcoReplayInfo(
            total_score=int(replay.userdata.score.value),
            timestamp=datetime.strptime(replay.userdata.date.value, "%y/%m/%d %H:%M"),
            name=replay.userdata.name.value,
            stage=stage,
            slowdown=float(replay.userdata.slowdown.value),
        )
