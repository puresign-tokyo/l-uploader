from replay_info import ReplayInfo, StageDetails
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class th11StageDetails(StageDetails, BaseModel):
    stage: Optional[int]=None
    score: Optional[int]=None
    power: Optional[int]=None
    piv: Optional[int]=None
    lives: Optional[int]=None
    life_pieces: Optional[int]=None
    graze: Optional[int]=None
    
    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "power": self.power,
            "piv": self.piv,
            "lives": self.lives,
            "life_pieces": self.lives,
            "graze": self.graze
        }

class th11ReplayInfo(ReplayInfo, BaseModel):
    name: str = ""
    shot_type: str = ""
    difficulty: int = -1
    total_score: int = Field(..., ge=0, le=10000000000)
    timestamp: datetime
    slowdown: float = Field(..., ge=0, le=100)
    
    replay_type: str = ""
    
    stage_details: list
    
    def convert_to_dict(self):
        return {
            "name": self.name,
            "shot_type": self.shot_type,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slow_down": self.slowdown,
            "stage_details": [stage_detail.convert_to_dict() for stage_detail in self.stage_details]
        }