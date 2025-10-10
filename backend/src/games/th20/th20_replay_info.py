from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH20ReplayInfo(BaseModel, ReplayInfo):
    name: str = ""
    shot_type: str = ""
    equipment: list[str] = []
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=30000000000)
    timestamp: datetime
    slowdown: float = Field(..., ge=0, le=100)

    replay_type: str = ""

    stage_details: list

    spell_card_id: int

    def convert_to_dict(self):
        return {
            "game_id": "th20",
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slowdown": self.slowdown,
            "spell_card_id": self.spell_card_id,
            "stage_details": [],
            "parser_version": 1,
        }
