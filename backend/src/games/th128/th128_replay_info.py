from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH128StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    graze: Optional[int] = None
    motivation: Optional[int] = None
    perfect_freeze: Optional[int] = None
    frozen_area: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "graze": self.graze,
            "motivation": self.motivation,
            "perfect_freeze": self.perfect_freeze,
            "frozen_area": self.frozen_area,
        }


class TH128ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=10000000000)
    timestamp: datetime
    slowdown: float = Field(..., ge=0, le=100)
    route: str = ""

    replay_type: str = ""

    stage_details: list

    def convert_to_dict(self):
        return {
            "game_id": "th128",
            "name": self.name,
            "difficulty": self.difficulty,
            "route": self.route,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slowdown": self.slowdown,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
            "parser_version": 1,
        }
