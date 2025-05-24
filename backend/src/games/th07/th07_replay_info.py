from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH07StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    point_items: Optional[int] = None
    graze: Optional[int] = None
    piv: Optional[int] = None
    cherry: Optional[int] = None
    cherrymax: Optional[int] = None
    power: Optional[int] = None
    lives: Optional[int] = None
    bombs: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "point_items": self.point_items,
            "graze": self.graze,
            "piv": self.piv,
            "cherry": self.cherry,
            "cherry_max": self.cherrymax,
            "power": self.power,
            "lives": self.lives,
            "bombs": self.bombs,
        }


class TH07ReplayInfo(BaseModel, ReplayInfo):
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
            "game_id": "th07",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "slowdown": self.slowdown,
            "replay_type": self.replay_type,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
        }
