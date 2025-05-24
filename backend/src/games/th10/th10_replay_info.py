from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH10StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    piv: Optional[int] = None
    power: Optional[int] = None
    lives: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "piv": self.piv,
            "power": self.power,
            "lives": self.lives,
        }


class TH10ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=10000000000)
    slowdown: float = Field(..., ge=0, le=100)
    timestamp: datetime

    replay_type: str = ""

    stage_details: list

    def convert_to_dict(self):
        return {
            "game_id": "th10",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "slowdown": self.slowdown,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
        }
