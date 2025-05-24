from datetime import datetime, timezone
import math
from parsers.py_code import th16, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th16.th16_replay_info import TH16ReplayInfo, TH16StageDetail


class TH16Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th16"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t16r"

    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th16.Th16.from_bytes(td.unlzss(comp_data))

        def get_shot(shot_id: int, season_id: int) -> str:
            shot_types = ["Reimu", "Cirno", "Aya", "Marisa"]
            seasons = ["Spring", "Summer", "Autumn", "Winter", ""]
            return shot_types[shot_id] + seasons[season_id]

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return TH16ReplayInfo(
                shot_type=get_shot(replay.header.shot, replay.header.season),
                difficulty=replay.header.difficulty,
                total_score=replay.header.score * 10,
                timestamp=datetime.fromtimestamp(
                    replay.header.timestamp, tz=timezone.utc
                ),
                name=replay.header.name.replace("\x00", ""),
                slowdown=replay.header.slowdown,
                replay_type="spell_card",
                spell_card_id=replay.header.spell_practice_id,
                stage_details=[],
            )

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            s = TH16StageDetail(
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
                s.season_power = next_stage_start_data.season_power
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        r_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            r_type = "stage_practice"

        r = TH16ReplayInfo(
            shot_type=get_shot(replay.header.shot, replay.header.season),
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(replay.header.timestamp, tz=timezone.utc),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=r_type,
            spell_card_id=replay.header.spell_practice_id,
            stage_details=rep_stages,
        )

        return r


TH16Parser()
