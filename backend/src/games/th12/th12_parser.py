from datetime import datetime, timezone
import math
from parsers.py_code import th12, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th12.th12_replay_info import th12ReplayInfo, th12StageDetails

class Th12Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x800, 0x5E, 0xE1)
        td.decrypt(comp_data, 0x40, 0x7D, 0x3A)
        replay = th12.Th12.from_bytes(td.unlzss(comp_data))

        shot_types = ["ReimuA", "ReimuB", "MarisaA", "MarisaB", "SanaeA", "SanaeB"]

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = th12StageDetails(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.power = next_stage_start_data.power
                s.piv = (math.trunc(next_stage_start_data.piv / 1000)) * 10
                s.lives = next_stage_start_data.lives
                s.life_pieces = next_stage_start_data.life_pieces
                #   fix zun fuckery
                if s.life_pieces > 0:
                    s.life_pieces -= 1
                s.bombs = next_stage_start_data.bombs
                s.bomb_pieces = next_stage_start_data.bomb_pieces
                s.graze = next_stage_start_data.graze
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            replay_type = "stage_practice"

        r = th12ReplayInfo(
            shot_type=shot_types[replay.header.shot * 2 + replay.header.subshot],
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