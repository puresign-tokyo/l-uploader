from abc import ABC, abstractmethod
from typing import TypedDict, Required


class StageDetail(ABC):
    @abstractmethod
    def convert_to_dict(self) -> dict: ...


class ReplayInfo(ABC):
    @abstractmethod
    # 必須で入れなければいけないキー
    # game_id: str
    #   th06 などのゲーム識別子
    # stage_details: list
    #   ステージ詳細情報が入った dict のリスト
    #   ステージ詳細情報が表示できないのなら空のリストでいいから付け加える
    def convert_to_dict(self) -> dict: ...
