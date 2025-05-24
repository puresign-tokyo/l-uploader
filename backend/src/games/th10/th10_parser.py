from datetime import datetime, timezone
from parsers.py_code import th10, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th10.th10_replay_info import TH10ReplayInfo, TH10StageDetail


class TH10Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th10"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t10r"

    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0xAA, 0xE1)
        td.decrypt(comp_data, 0x80, 0x3D, 0x7A)
        replay = th10.Th10.from_bytes(td.unlzss(comp_data))

        shot_types = ["ReimuA", "ReimuB", "ReimuC", "MarisaA", "MarisaB", "MarisaC"]

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = TH10StageDetail(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.power = next_stage_start_data.power
                s.piv = next_stage_start_data.piv * 10
                s.lives = next_stage_start_data.lives
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            replay_type = "stage_practice"

        r = TH10ReplayInfo(
            shot_type=shot_types[replay.header.shot * 3 + replay.header.subshot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(replay.header.timestamp, tz=timezone.utc),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r


TH10Parser()
