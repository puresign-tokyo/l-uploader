from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH08StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    point_items: Optional[int] = None
    graze: Optional[int] = None
    piv: Optional[int] = None
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
            "power": self.power,
            "lives": self.lives,
            "bombs": self.bombs,
        }


class TH08ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=10000000000)
    slowdown: float = Field(..., ge=0, le=100)
    timestamp: datetime

    route: str = ""

    replay_type: str = ""

    spell_card_id: int = 0

    stage_details: list

    def convert_to_dict(self):
        return {
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "slowdown": self.slowdown,
            "timestamp": self.timestamp.isoformat(),
            "route": self.route,
            "replay_type": self.replay_type,
            "spell_card_id": self.spell_card_id,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
        }
