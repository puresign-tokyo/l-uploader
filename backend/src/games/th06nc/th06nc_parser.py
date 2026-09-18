from datetime import datetime
from parsers.py_code import th06nc
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th06nc.th06nc_replay_info import TH06ncReplayInfo, TH06ncStageDetail


class TH06ncParser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th6nc"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"T6RP" and rep_raw[4] == 0x0F

    def parse(self, rep_raw: bytes):
        cryptdata = bytearray(rep_raw[0x13:])
        key = rep_raw[0x12]
        td.decrypt06(cryptdata, key)
        replay = th06nc.Th06nc.from_bytes(cryptdata)

        shot_types = ["ReimuA", "ReimuB", "MarisaA", "MarisaB"]

        rep_stages = []

        replay_type = "full_game"
        if rep_raw[6] == 1:
            replay_type = "nc_challenge"
        elif rep_raw[6] == 3:
            # スペルカード
            return TH06ncReplayInfo(
                shot_type=shot_types[rep_raw[7]],
                difficulty=-1,
                total_score=replay.file_header.score,
                timestamp=datetime.strptime(replay.file_header.date, "%m/%d/%y"),
                name=replay.file_header.name.replace("\x00", ""),
                slowdown=replay.file_header.slowdown,
                replay_type="spell_card",
                spell_card_id=rep_raw[8],
                stage_details=[],
            )

        enumerated_non_dummy_stages = [
            (i, _pointer.body)
            for i, _pointer in enumerate(replay.file_header.stage_offsets)
            if _pointer.body
        ]
        # TH06 stores stage data values from the start of the stage but score from the end
        for (i, current_stage), (j, next_stage) in zip(
            enumerated_non_dummy_stages,
            enumerated_non_dummy_stages[1:] + [(None, None)],
        ):
            s = TH06ncStageDetail(stage=i + 1, score=current_stage.score)
            if next_stage is not None:
                s.power = next_stage.power
                s.lives = next_stage.lives
                s.bombs = next_stage.bombs
                if replay_type == "nc_challenge":
                    s.misses = next_stage.misses
            rep_stages.append(s)

        if len(rep_stages) == 1 and rep_raw[8] != 4:
            replay_type = "stage_practice"

        r = TH06ncReplayInfo(
            shot_type=shot_types[rep_raw[7]],
            difficulty=rep_raw[8],
            total_score=replay.file_header.score,
            timestamp=datetime.strptime(replay.file_header.date, "%m/%d/%y"),
            name=replay.file_header.name.replace("\x00", ""),
            slowdown=replay.file_header.slowdown,
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r

    def filename_prefix(self) -> str:
        return "th6"


TH06ncParser()
