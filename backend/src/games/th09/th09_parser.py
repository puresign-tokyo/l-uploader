from datetime import datetime
from parsers.py_code import th09
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th09.th09_replay_info import TH09ReplayInfo, TH09StageDetail


class TH09Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th09"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"T9RP"

    def parse(self, rep_raw: bytes):
        comp_data_size = int.from_bytes(rep_raw[12:16], byteorder="little") - 24
        comp_data = bytearray(rep_raw[24:comp_data_size])
        td.decrypt06(comp_data, rep_raw[21])
        #   0xc0 (192) - 24 = 168
        replay = th09.Th09.from_bytes(
            bytearray(rep_raw[0:24]) + comp_data[0:168] + td.unlzss(comp_data[168:])
        )
        stage_pointers = replay.file_header.stage_offsets
        shot_types = [
            "Reimu",
            "Marisa",
            "Sakuya",
            "Youmu",
            "Reisen",
            "Cirno",
            "Lyrica",
            "Mystia",
            "Tewi",
            "Yuuka",
            "Aya",
            "Medicine",
            "Komachi",
            "Eiki",
            "Merlin",
            "Lunasa",
        ]

        rep_stages = []
        replay_score = 0
        shot_type = "Bug shot"
        replay_type = "full_game"

        highest_stage = 0
        if not stage_pointers[9].body:
            #  story mode
            #  collect start-of-stage data
            for i in range(9):
                if stage_pointers[i].body:
                    #   real stage
                    p1 = stage_pointers[i].body
                    p2 = stage_pointers[i + 10].body

                    s = TH09StageDetail()
                    s.stage = i + 1
                    s.score = p1.score * 10
                    s.lives = p1.lives

                    s.p1_cpu = False
                    s.p2_cpu = True
                    s.p2_shot = shot_types[p2.shot]
                    s.p2_score = p2.score * 10

                    highest_stage = i
                    rep_stages.append(s)

                #  fill in replayinfo
                p1 = stage_pointers[highest_stage].body
                shot_type = shot_types[p1.shot]
                replay_score = p1.score * 10

            #  adjust stage data to be end-of-stage by shuffling them down from the next stage
            for i in range(len(rep_stages)):
                if i < len(rep_stages) - 1:
                    stage = rep_stages[i]
                    next_stage = rep_stages[i + 1]

                    stage.score = next_stage.score
                    stage.lives = next_stage.lives
                    stage.p2_score = next_stage.p2_score
                else:
                    stage = rep_stages[i]
                    stage.score = None
                    stage.lives = None
                    stage.p2_score = None

        else:
            #   vs mode
            p1 = stage_pointers[9].body
            p2 = stage_pointers[19].body

            shot_type = shot_types[p1.shot]
            replay_score = p1.score * 10

            s = TH09StageDetail()
            s.stage = 1
            s.score = p1.score * 10
            s.p1_cpu = p1.ai
            s.p2_cpu = p2.ai
            s.p2_shot = shot_types[p2.shot]
            s.p2_score = p2.score * 10

            if s.p1_cpu is False and s.p2_cpu is False:
                replay_type = "player_vs_player"  # mark pvp replays as such
            elif s.p1_cpu is True and s.p2_cpu is True:
                replay_type = "cpu_vs_cpu"
            else:
                replay_type = "player_vs_cpu"  # treat any "pvp" replay with an ai in it as stage practice

            rep_stages.append(s)

        r = TH09ReplayInfo(
            shot_type=shot_type,
            difficulty=replay.header.difficulty,
            total_score=replay_score,
            timestamp=datetime.strptime(replay.header.date, "%y/%m/%d"),
            name=replay.header.name.replace("\x00", ""),
            replay_type=replay_type,
            stage_details=rep_stages,
        )

        return r


TH09Parser()
