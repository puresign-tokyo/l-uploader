from datetime import datetime, timezone
import math
from parsers.py_code import th18, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th18.th18_replay_info import th18ReplayInfo, th18StageDetail

class Th18Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th18.Th18.from_bytes(td.unlzss(comp_data))

        shots = ["Reimu", "Marisa", "Sakuya", "Sanae"]

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return th18ReplayInfo(
                shot=shots[replay.header.shot],
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

        rep_stages = []

        for current_stage, next_stage in zip(replay.stages, replay.stages[1:] + [None]):
            current_stage_end_data = current_stage.stage_data_end
            s = th18StageDetail(
                stage=current_stage.stage_num,
                power=current_stage_end_data.power,
                piv=(math.trunc(current_stage_end_data.piv / 1000)) * 10,
                lives=current_stage_end_data.lives,
                life_pieces=current_stage_end_data.life_pieces,
                bombs=current_stage_end_data.bombs,
                bomb_pieces=current_stage_end_data.bomb_pieces,
                graze=current_stage_end_data.graze,
            )
            if next_stage is not None:
                # The end-of-stage data does not add the stage's clear bonus.
                # Therefore, we have to use the next stage's data.
                s.score = next_stage.stage_data_start.score * 10
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        r_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            r_type = "stage_practice"

        r = th18ReplayInfo(
            shot_type=shots[replay.header.shot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(
                replay.header.timestamp, tz=timezone.utc
            ),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=r_type,
            spell_card_id=replay.header.spell_practice_id,
            stage_details=rep_stages,
        )

        return r