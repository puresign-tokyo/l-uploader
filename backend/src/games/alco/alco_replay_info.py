from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AlcoStageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
        }


class AlcoReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    timestamp: datetime
    total_score: int = Field(..., ge=0, le=1000000000)
    slowdown: float = Field(..., ge=0, le=100)

    stage_details: list

    def convert_to_dict(self):
        return {
            "game_id": "alco",
            "name": self.name,
            "timestamp": self.timestamp.isoformat(),
            "total_score": self.total_score,
            "slowdown": self.slowdown,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
            "parser_version": 2,
        }
