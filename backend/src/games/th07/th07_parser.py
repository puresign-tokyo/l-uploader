from datetime import datetime
from parsers.py_code import th07
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th07.th07_replay_info import TH07ReplayInfo, TH07StageDetail


class TH07Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th07"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"T7RP"

    def parse(self, rep_raw: bytes):
        comp_data = bytearray(rep_raw[16:])
        td.decrypt06(comp_data, rep_raw[13])
        #   please don't ask what is going on here
        #   0x54 - 16 = 68

        comp_size = int.from_bytes(comp_data[4:8], byteorder="little")
        replay = th07.Th07.from_bytes(
            bytearray(rep_raw[0:16])
            + comp_data[0:68]
            + td.unlzss(comp_data[68 : 68 + comp_size])
        )

        shot_types = ["ReimuA", "ReimuB", "MarisaA", "MarisaB", "SakuyaA", "SakuyaB"]

        rep_stages = []

        enumerated_non_dummy_stages = [
            (i, _pointer.body)
            for i, _pointer in enumerate(replay.file_header.stage_offsets)
            if _pointer.body
        ]

        def is_phantasm(difficulty_code: int) -> bool:
            return difficulty_code == 5

        # TH07 stores stage data values from the start of the stage but score from the end
        for (i, current_stage), (j, next_stage) in zip(
            enumerated_non_dummy_stages,
            enumerated_non_dummy_stages[1:] + [(None, None)],
        ):
            s = TH07StageDetail(
                stage=i + 2 if is_phantasm(replay.header.difficulty) else i + 1,
                score=current_stage.score * 10,
            )
            if next_stage is not None:
                s.power = next_stage.power
                s.piv = next_stage.piv
                s.lives = next_stage.lives
                s.bombs = next_stage.bombs
                s.graze = next_stage.graze
                s.point_items = next_stage.point_items
                s.cherry = next_stage.cherry
                s.cherrymax = next_stage.cherrymax

            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty not in [4, 5]:
            replay_type = "stage_practice"

        # Touhou 7 does not store the year of the replay, but datetimes requires one.
        # Therefore we set one. It must be a leap year in order for Feb 29 to be valid.
        arbitrary_leap_year = 1904
        timestamp = datetime.strptime(
            f"{replay.header.date}/{arbitrary_leap_year}", "%m/%d/%Y"
        )

        r = TH07ReplayInfo(
            name=replay.header.name.replace("\x00", ""),
            shot_type=shot_types[replay.header.shot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=timestamp,
            slowdown=replay.header.slowdown,
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r


TH07Parser()
