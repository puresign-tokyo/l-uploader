from datetime import datetime, timezone
import math
from parsers.py_code import th13, th_modern
from parsers.base_parser import BaseParser
import tsadecode as td
from games.th13.th13_replay_info import TH13ReplayInfo, TH13StageDetail


class TH13Parser(BaseParser):

    def get_supported_game_id(self) -> str:
        return "th13"

    def can_parse(self, rep_raw: bytes) -> bool:

        # th13とth14のファイルのマジック値はどちらも t13r というバグがある
        # よってマジックを確認するだけではth13とth14のどちらのリプレイファイルか分からない
        # リプレイファイルの末尾に平文で
        # `東方[神霊廟 | 輝針城][SP]リプレイファイル情報`
        # と書かれている項があり、それをもとに判定することができる

        # 重いパースをしなくてもth13リプレイファイルでないとわかるなら即返す
        if rep_raw[:4] != b"t13r":
            return False

        header = th_modern.ThModern.from_bytes(rep_raw)

        # [0x90, 0xC9] はshift-jisで `廟`
        if header.userdata.user_desc[4] in [0x90, 0xC9]:
            return True

        return False

    def parse(self, rep_raw: bytes):
        header = th_modern.ThModern.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0x5C, 0xE1)
        td.decrypt(comp_data, 0x100, 0x7D, 0x3A)
        replay = th13.Th13.from_bytes(td.unlzss(comp_data))

        shot_types = ["Reimu", "Marisa", "Sanae", "Youmu"]

        rep_stages = []

        if replay.header.spell_practice_id != 0xFFFFFFFF:
            return TH13ReplayInfo(
                shot_type=shot_types[replay.header.shot],
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

        # TH13 stores stage data values from the start of the stage but score from the end
        for current_stage, next_stage in zip(replay.stages, replay.stages[1:] + [None]):
            s = TH13StageDetail(
                stage=current_stage.stage_num, score=replay.header.score * 10
            )
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

        r = TH13ReplayInfo(
            shot_type=shot_types[replay.header.shot],
            difficulty=replay.header.difficulty,
            total_score=replay.header.score * 10,
            timestamp=datetime.fromtimestamp(replay.header.timestamp, tz=timezone.utc),
            name=replay.header.name.replace("\x00", ""),
            slowdown=replay.header.slowdown,
            replay_type=replay_type,
            spell_card_id=replay.header.spell_practice_id,
            stage_details=rep_stages,
        )

        return r


TH13Parser()
