from datetime import datetime
from parsers.py_code import th06
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th06.th06_replay_info import th06ReplayInfo, th06StageDetails

class Th06Parser(BaseParser):
    
    def parse(self, rep_raw: bytes):
        cryptdata = bytearray(rep_raw[15:])
        td.decrypt06(cryptdata, rep_raw[14])
        replay = th06.Th06.from_bytes(cryptdata)

        shot_types = ["ReimuA", "ReimuB", "MarisaA", "MarisaB"]

        rep_stages = []

        enumerated_non_dummy_stages = [
            (i, _pointer.body)
            for i, _pointer in enumerate(replay.file_header.stage_offsets)
            if _pointer.body
        ]
        # TH06 stores stage data values from the start of the stage but score from the end
        for (i, current_stage), (j, next_stage) in zip(
            enumerated_non_dummy_stages, enumerated_non_dummy_stages[1:] + [(None, None)]
        ):
            s = th06StageDetails(stage=i + 1, score=current_stage.score)
            if next_stage is not None:
                s.power = next_stage.power
                s.lives = next_stage.lives
                s.bombs = next_stage.bombs
                s.rank = next_stage.rank

            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and rep_raw[7] != 4:
            replay_type = "stage_practice"

        r = th06ReplayInfo(
            shot_type=shot_types[rep_raw[6]],
            difficulty=rep_raw[7],
            total_score=replay.file_header.score,
            timestamp=datetime.strptime(replay.file_header.date, "%m/%d/%y"),
            name=replay.file_header.name.replace("\x00", ""),
            slowdown=replay.file_header.slowdown,
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r
