from datetime import datetime, timezone
import math
from parsers.py_code import th20_header, th20
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th20.th20_replay_info import TH20ReplayInfo


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

    def parse(self, rep_raw: bytes):
        header = th20_header.Th20Header.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        decomp = td.unlzss(comp_data)

        replay = th20.Th20.from_bytes(decomp)
        character = ["Reimu", "Marisa"][int(replay.header.shot)]
        stones = [subshot_to_stone(stone_id) for stone_id in replay.header.stones]
        shot = character + stones[0]

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            r = TH20ReplayInfo(
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
                stage_details=[],
                spell_card_id=replay.header.spell_practice_id,
            )
            return r

        r_type = "full_game"
        if replay.header.stage_count == 1 and replay.header.difficulty != 4:
            r_type = "stage_practice"

        r = TH20ReplayInfo(
            shot_type=shot,
            equipment=stones,
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(replay.header.timestamp, tz=timezone.utc),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=r_type,
            stage_details=[],
            spell_card_id=replay.header.spell_practice_id,
        )

        return r


TH20Parser()
