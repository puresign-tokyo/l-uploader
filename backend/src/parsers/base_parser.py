from abc import ABC, abstractmethod
from replay_info import ReplayInfo


class BaseParser(ABC):

    _instances = {}

    def __init_subclass__(cls):
        # 循環参照をなくすため
        from game_registry import GameRegistry

        GameRegistry.add_parser(cls)

        def singleton_new(cls, *args, **kwargs):
            if cls not in BaseParser._instances:
                BaseParser._instances[cls] = super(BaseParser, cls).__new__(cls)
            return BaseParser._instances[cls]

        cls.__new__ = singleton_new

    @abstractmethod
    def get_supported_game_id(self) -> str: ...

    @abstractmethod
    def can_parse(self, rep_raw: bytes) -> bool: ...

    @abstractmethod
    def parse(self, rep_raw: bytes) -> ReplayInfo: ...
