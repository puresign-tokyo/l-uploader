from replay_info import ReplayInfo
from pydantic import BaseModel, Field
from datetime import datetime


class AlcoReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    timestamp: datetime
    stage: str = ""
    total_score: int = Field(..., ge=0, le=1000000000)
    slowdown: float = Field(..., ge=0, le=100)

    def convert_to_dict(self):
        return {
            "game_id": "alco",
            "name": self.name,
            "timestamp": self.timestamp.isoformat(),
            "stage": self.stage,
            "total_score": self.total_score,
            "slow_down": self.slowdown,
            "stage_details": [],
            "parser_version": 1,
        }
