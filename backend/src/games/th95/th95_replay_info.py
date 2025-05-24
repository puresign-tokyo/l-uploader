from replay_info import ReplayInfo
from pydantic import BaseModel, Field
from datetime import datetime


class TH95ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    level: int = -1
    scene: int = -1
    timestamp: datetime
    total_score: int = Field(..., ge=0, le=10000000000)
    slowdown: float = Field(..., ge=0, le=100)

    def convert_to_dict(self):
        return {
            "game_id": "th95",
            "name": self.name,
            "level": self.level,
            "scene": self.scene,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "slow_down": self.slowdown,
            "stage_details": [],
        }
