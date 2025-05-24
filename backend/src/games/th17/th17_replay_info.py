from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH17StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    power: Optional[int] = None
    piv: Optional[int] = None
    lives: Optional[int] = None
    life_pieces: Optional[int] = None
    bombs: Optional[int] = None
    bomb_pieces: Optional[int] = None
    graze: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "power": self.power,
            "piv": self.piv,
            "lives": self.lives,
            "life_pieces": self.lives,
            "bombs": self.bombs,
            "bomb_pieces": self.bomb_pieces,
            "graze": self.graze,
        }


class TH17ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=10000000000)
    timestamp: datetime
    slowdown: float = Field(..., ge=0, le=100)

    replay_type: str = ""

    stage_details: list

    spell_card_id: int

    def convert_to_dict(self):
        return {
            "game_id": "th17",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slow_down": self.slowdown,
            "spell_card_id": self.spell_card_id,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
        }
