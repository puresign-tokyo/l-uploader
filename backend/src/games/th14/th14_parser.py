from datetime import datetime, timezone
import math
from parsers.py_code import th14, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th14.th14_replay_info import th14ReplayInfo, th14StageDetails

class Th14Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th14.Th14.from_bytes(td.unlzss(comp_data))

        shot_types = ["ReimuA", "ReimuB", "MarisaA", "MarisaB", "SakuyaA", "SakuyaB"]
        rep_stages = []

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return th14ReplayInfo(
                shot=shot_types[replay.header.shot * 2 + replay.header.subshot],
                difficulty=replay.header.difficulty,
                total_score=replay.header.score * 10,
                timestamp=datetime.fromtimestamp(
                    replay.header.timestamp, tz=timezone.utc
                ),
                name=replay.header.name.replace("\x00", ""),
                slowdown=replay.header.slowdown,
                replay_type="spell_card",
                spell_card_id=replay.header.spell_practice_id,
                stage_details=[]
            )

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = th14StageDetails(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.power = next_stage_start_data.power
                s.piv = (math.trunc(next_stage_start_data.piv / 1000)) * 10
                s.lives = next_stage_start_data.lives
                s.life_pieces = next_stage_start_data.life_pieces
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

        r = th14ReplayInfo(
            shot_type=shot_types[replay.header.shot * 2 + replay.header.subshot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(
                replay.header.timestamp, tz=timezone.utc
            ),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=replay_type,
            spell_card_id=replay.header.spell_practice_id,
            stage_details=rep_stages,
        )

        return r