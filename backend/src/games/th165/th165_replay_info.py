from replay_info import ReplayInfo
from pydantic import BaseModel, Field
from datetime import datetime


class TH165ReplayInfo(BaseModel, ReplayInfo):
    game_version: str = ""
    name: str = ""
    level: int = -1
    scene: int = -1
    timestamp: datetime
    slow_down: float = Field(..., ge=0, le=100)

    def convert_to_dict(self):
        return {
            "game_id": "th165",
            "game_version": self.game_version,
            "name": self.name,
            "level": self.level,
            "scene": self.scene,
            "total_score": 0,
            "timestamp": self.timestamp.isoformat(),
            "slowdown": self.slow_down,
            "stage_details": [],
            "parser_version": 1,
        }
