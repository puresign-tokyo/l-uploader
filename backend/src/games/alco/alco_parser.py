from datetime import datetime, timezone
from parsers.py_code import alco_encrypted, alco_userdata
from parsers.base_parser import BaseParser
import tsadecode as td
from games.alco.alco_replay_info import AlcoReplayInfo, AlcoStageDetail


class AlcoParser(BaseParser):
    def get_supported_game_id(self) -> str:
        return "alco"

    def can_parse(self, rep_raw: bytes) -> bool:
        return rep_raw[:4] == b"al1r"

    def parse(self, rep_raw: bytes):
        header = alco_userdata.AlcoUserdata.from_bytes(rep_raw)
        comp_data = bytearray(header.main.comp_data)

        td.decrypt(comp_data, 0x400, 0xAA, 0xE1)
        td.decrypt(comp_data, 0x80, 0x3D, 0x7A)
        replay = alco_encrypted.AlcoEncrypted.from_bytes(td.unlzss(comp_data))

        rep_stages = []

        for current_stage_start_data, next_stage_start_data in zip(
            replay.stages, replay.stages[1:] + [None]
        ):
            # if next_stage_start_data is not None:
            s = AlcoStageDetail(
                stage=current_stage_start_data.stage_num,
            )
            if next_stage_start_data is not None:
                s.score = next_stage_start_data.score
            else:
                s.score = replay.header.total_score

            rep_stages.append(s)

        return AlcoReplayInfo(
            total_score=int(replay.header.total_score),
            timestamp=datetime.fromtimestamp(replay.header.timestamp, tz=timezone.utc),
            name=replay.header.name.replace("\x00", ""),
            slowdown=float(replay.header.slowdown),
            stage_details=rep_stages,
        )


AlcoParser()
