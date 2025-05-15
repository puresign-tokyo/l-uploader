from datetime import datetime, timezone
from parsers.py_code import th11, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th11.th11_replay_info import th11ReplayInfo, th11StageDetails

class Th11Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x800, 0xAA, 0xE1)
        td.decrypt(comp_data, 0x40, 0x3D, 0x7A)
        replay = th11.Th11.from_bytes(td.unlzss(comp_data))

        shot_types = ["ReimuA", "ReimuB", "ReimuC", "MarisaA", "MarisaB", "MarisaC"]

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = th11StageDetails(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.power = next_stage_start_data.power
                s.piv = next_stage_start_data.piv
                s.lives = next_stage_start_data.lives
                s.life_pieces = next_stage_start_data.life_pieces
                s.graze = next_stage_start_data.graze
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            replay_type = "stage_practice"

        r = th11ReplayInfo(
            shot_type=shot_types[replay.header.shot * 3 + replay.header.subshot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(
                replay.header.timestamp, tz=timezone.utc
            ),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r