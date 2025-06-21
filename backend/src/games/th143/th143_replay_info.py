from replay_info import ReplayInfo
from pydantic import BaseModel, Field
from datetime import datetime


class TH143ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    level: int = -1
    scene: int = -1
    timestamp: datetime
    total_score: int = Field(..., ge=0, le=10000000000)
    slow_down: float = Field(..., ge=0, le=100)

    def convert_to_dict(self) -> dict:
        return {
            "game_id": "th143",
            "name": self.name,
            "level": self.level,
            "scene": self.scene,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "slowdown": self.slow_down,
            "stage_details": [],
            "parser_version": 1,
        }
