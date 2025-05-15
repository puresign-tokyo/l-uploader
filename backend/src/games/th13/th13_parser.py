from datetime import datetime, timezone
import math
from parsers.py_code import th13, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th13.th13_replay_info import th13ReplayInfo, th13StageDetails

class Th13Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th13.Th13.from_bytes(td.unlzss(comp_data))

        shot_types = ["Reimu", "Marisa", "Sanae", "Youmu"]

        rep_stages = []

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return th13ReplayInfo(
                shot=shot_types[replay.header.shot],
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

        # TH13 stores stage data values from the start of the stage but score from the end
        for current_stage, next_stage in zip(replay.stages, replay.stages[1:] + [None]):
            s = th13StageDetails(stage=current_stage.stage_num, score=replay.header.score * 10)
            if next_stage is not None:
                s.score = next_stage.score * 10
                s.power = next_stage.power
                # piv is stored with extra precision, we trunctate the value to what is shown ingame
                s.piv = (math.trunc(next_stage.piv / 1000)) * 10 
                s.lives = next_stage.lives
                s.life_pieces = next_stage.life_pieces
                s.bombs = next_stage.bombs
                s.bomb_pieces = next_stage.bomb_pieces
                s.graze = next_stage.graze
                s.trance = next_stage.trance
                s.extends = next_stage.extends
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            replay_type = "stage_practice"

        r = th13ReplayInfo(
            shot_type=shot_types[replay.header.shot],
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