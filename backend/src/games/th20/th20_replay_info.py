from replay_info import ReplayInfo, StageDetail
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TH20StageDetail(BaseModel, StageDetail):
    stage: Optional[int] = None
    score: Optional[int] = None
    power: Optional[int] = None
    piv: Optional[int] = None
    lives: Optional[int] = None
    life_pieces: Optional[int] = None
    bombs: Optional[int] = None
    bomb_pieces: Optional[int] = None
    hyper: Optional[int] = None

    red: Optional[int] = None
    blue: Optional[int] = None
    yellow: Optional[int] = None
    green: Optional[int] = None

    total_stone_count: Optional[int] = None

    def convert_to_dict(self):
        return {
            "stage": self.stage,
            "score": self.score,
            "power": self.power,
            "piv": self.piv,
            "lives": self.lives,
            "life_pieces": self.life_pieces,
            "bombs": self.bombs,
            "bomb_pieces": self.bomb_pieces,
            "hyper": self.hyper,
            "red": self.red,
            "blue": self.blue,
            "yellow": self.yellow,
            "green": self.green,
            "total_stone_count": self.total_stone_count,
        }


class TH20ReplayInfo(BaseModel, ReplayInfo):
    game_version: str = ""
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
            "game_version": self.game_version,
            "name": self.name,
            "shot_type": self.shot_type,
            "equipment": self.equipment,
            "difficulty": self.difficulty,
            "total_score": self.total_score,
            "timestamp": self.timestamp.isoformat(),
            "replay_type": self.replay_type,
            "slowdown": self.slowdown,
            "spell_card_id": self.spell_card_id,
            "stage_details": [
                stage_detail.convert_to_dict() for stage_detail in self.stage_details
            ],
            "parser_version": 2,
        }
