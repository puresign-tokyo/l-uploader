from datetime import datetime, timezone
import math
from parsers.py_code import th20, th20_header
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th20.th20_replay_info import TH20ReplayInfo, TH20StageDetail
from replay_info import ReplayInfo


def subshot_to_stone(stone_id: int) -> str:
    return [
        "Red",
        "Red2",
        "Blue",
        "Blue2",
        "Yellow",
        "Yellow2",
        "Green",
        "Green2",
        "Common",
    ][stone_id]


class TH20Parser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "th20"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"t20r"

    def parse(self, rep_raw: bytes) -> ReplayInfo:
        header = th20_header.Th20Header.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th20.Th20.from_bytes(td.unlzss(comp_data))

        character = ["Reimu", "Marisa"][int(replay.header.shot)]

        stones = [subshot_to_stone(stone_id) for stone_id in replay.header.stones]
        shot = character + stones[0]

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return TH20ReplayInfo(
                game_version=str(header.userdata.user_ver.value),
                shot_type=shot,
                equipment=stones,
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
            s = TH20StageDetail(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score * 10
                s.power = next_stage_start_data.power
                s.piv = int(next_stage_start_data.piv / 50)
                s.lives = next_stage_start_data.lives
                s.life_pieces = next_stage_start_data.life_pieces
                s.bombs = next_stage_start_data.bombs
                s.bomb_pieces = next_stage_start_data.bomb_pieces
                s.hyper = next_stage_start_data.hyper

                s.red = next_stage_start_data.red
                s.blue = next_stage_start_data.blue
                s.yellow = next_stage_start_data.yellow
                s.green = next_stage_start_data.green

                s.total_stone_count = next_stage_start_data.total_stone_count
            else:
                # no next stage means this is the last stage, so use the final run score
                s.score = replay.header.score * 10
            rep_stages.append(s)

        r_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            r_type = "stage_practice"

        r = TH20ReplayInfo(
            game_version=str(header.userdata.user_ver.value),
            shot_type=shot,
            equipment=stones,
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


TH20Parser()
