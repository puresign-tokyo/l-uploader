from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH06ncStageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    power: Optional[int] = None
    lives: Optional[int] = None
    bombs: Optional[int] = None
    misses: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "power": self.power,
            "lives": self.lives,
            "bombs": self.bombs,
            "misses": self.misses,
        }


class TH06ncReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=1500000000)
    slowdown: float = Field(..., ge=0, le=100)
    timestamp: datetime

    replay_type: str = ""

    spell_card_id: int = 0

    stage_details: list

    def convert_to_dict(self):
        return {
            "game_id": "th6nc",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "slowdown": self.slowdown,
            "replay_type": self.replay_type,
            "spell_card_id": self.spell_card_id,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
            "parser_version": 1,
        }
