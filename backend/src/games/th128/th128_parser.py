from datetime import datetime, timezone
import math
from parsers.py_code import th128, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th128.th128_replay_info import th128ReplayInfo, th128StageDetails

class Th128Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x800, 0x5E, 0xE7)
        td.decrypt(comp_data, 0x80, 0x7D, 0x36)
        replay = th128.Th128.from_bytes(td.unlzss(comp_data))

        routes = [
            "A-1",
            "A-2",
            "B-1",
            "B-2",
            "C-1",
            "C-2",
        ]

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = th128StageDetails(
                stage=current_stage_start_data.stage,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.graze = next_stage_start_data.graze
                s.motivation = next_stage_start_data.motivation
                s.perfect_freeze = next_stage_start_data.perfect_freeze
                s.frozen_area = next_stage_start_data.frozen_area
            else:
                s.score = replay.header.score * 10
            rep_stages.append(s)

        return th128ReplayInfo(
            route=routes[replay.header.route] if replay.header.route != 6 else "extra",
            replay_type="full_game",
            name=replay.header.name.replace("\x00", ""),
            timestamp=datetime.fromtimestamp(
                replay.header.timestamp, tz=timezone.utc
            ),
            total_score=replay.header.score * 10,
            slowdown=replay.header.slowdown,
            difficulty=replay.header.difficulty,
            stage_details=rep_stages,
        )