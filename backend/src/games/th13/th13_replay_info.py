from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH13StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    power: Optional[int] = None
    piv: Optional[int] = None
    lives: Optional[int] = None
    life_pieces: Optional[int] = None
    bombs: Optional[int] = None
    bomb_pieces: Optional[int] = None
    graze: Optional[int] = None
    trance: Optional[int] = None
    extends: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "power": self.power,
            "piv": self.piv,
            "lives": self.lives,
            "life_pieces": self.life_pieces,
            "bombs": self.bombs,
            "bomb_pieces": self.bomb_pieces,
            "graze": self.graze,
            "trance": self.trance,
            "extends": self.extends,
        }


class TH13ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=6000000000)
    timestamp: datetime
    slowdown: float = Field(..., ge=0, le=100)
    spell_card_id: int

    replay_type: str = ""

    stage_details: list

    def convert_to_dict(self):
        return {
            "game_id": "th13",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slowdown": self.slowdown,
            "spell_card_id": self.spell_card_id,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
            "parser_version": 1,
        }
