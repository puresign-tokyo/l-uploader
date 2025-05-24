from datetime import datetime
from parsers.py_code import th08, th08_userdata
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th08.th08_replay_info import TH08ReplayInfo, TH08StageDetail


class TH08Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th08"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"T8RP"

    def parse(self, rep_raw: bytes):
        comp_data_size = int.from_bytes(rep_raw[12:16], byteorder="little") - 24
        comp_data = bytearray(rep_raw[24:comp_data_size])

        #   read the userdata section to use the date for later
        #   th08_userdata is a modified version of thmodern adapted to ZUN's early userdata format
        user = th08_userdata.Th08Userdata.from_bytes(rep_raw)

        td.decrypt06(comp_data, rep_raw[21])
        #   basically copied from _Parse07()
        #   0x68 (104) - 24 = 80
        replay = th08.Th08.from_bytes(
            bytearray(rep_raw[0:24]) + comp_data[0:80] + td.unlzss(comp_data[80:])
        )

        shot_types = [
            "Reimu & Yukari",
            "Marisa & Alice",
            "Sakuya & Remilia",
            "Youmu & Yuyuko",
            "Reimu",
            "Yukari",
            "Marisa",
            "Alice",
            "Sakuya",
            "Remilia",
            "Youmu",
            "Yuyuko",
        ]

        rep_stages = []

        if replay.header.spell_card_id != 65535:  # FF FF
            return TH08ReplayInfo(
                name=replay.header.name.replace("\x00", ""),
                shot_type=shot_types[replay.header.shot],
                difficulty=replay.header.difficulty,
                total_score=replay.header.score * 10,
                slowdown=replay.header.slowdown,
                timestamp=datetime.strptime(
                    (
                        user.userdata.date.value
                        if user.userdata is not None
                        else "1970/01/01 00:00:00"
                    ),
                    "%Y/%m/%d %H:%M:%S",
                ),
                route="",
                replay_type="spell_card",
                spell_card_id=replay.header.spell_card_id,
                stage_details=[],
            )

        #   else full run

        # TH08 stores stage data values from the start of the stage but score from the end
        route = ""

        enumerated_non_dummy_stages = [
            (i, _pointer.body)
            for i, _pointer in enumerate(replay.file_header.stage_offsets)
            if _pointer.body
        ]

        for (i, current_stage), (j, next_stage) in zip(
            enumerated_non_dummy_stages,
            enumerated_non_dummy_stages[1:] + [(None, None)],
        ):
            s = TH08StageDetail(
                stage=i + 1,
                score=current_stage.score * 10,
            )
            if next_stage is not None:
                s.power = next_stage.power
                s.piv = next_stage.piv
                s.lives = next_stage.lives
                s.bombs = next_stage.bombs
                s.graze = next_stage.graze
                s.point_items = next_stage.point_items

            if i == 6:
                route = "Final A"
            elif i == 7:
                route = "Final B"

            rep_stages.append(s)

        replay_type = "full_game"
        if len(rep_stages) == 1 and replay.header.difficulty != 4:
            replay_type = "stage_practice"

        r = TH08ReplayInfo(
            name=replay.header.name.replace("\x00", ""),
            shot_type=shot_types[replay.header.shot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            slowdown=replay.header.slowdown,
            timestamp=datetime.strptime(
                (
                    user.userdata.date.value
                    if user.userdata is not None
                    else "1970/01/01 00:00:00"
                ),
                "%Y/%m/%d %H:%M:%S",
            ),
            route=route,
            replay_type=replay_type,
            spell_card_id=replay.header.spell_card_id,
            stage_details=rep_stages,
        )

        return r


TH08Parser()
