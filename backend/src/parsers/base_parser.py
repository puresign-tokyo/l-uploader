from abc import ABC, abstractmethod
from replay_info import ReplayInfo


class BaseParser(ABC):

    _instances = {}

    def __init_subclass__(cls):
        # 循環参照をなくすため
        from parsers.parser_registry import ParserRegistry

        ParserRegistry.add_parser(cls)

        def singleton_new(subcls, *args, **kwargs):
            if subcls not in BaseParser._instances:
                BaseParser._instances[subcls] = super(BaseParser, subcls).__new__(
                    subcls
                )
            return BaseParser._instances[subcls]

        cls.__new__ = singleton_new

    @abstractmethod
    def can_parse(self, rep_raw: bytes) -> bool: ...

    @abstractmethod
    def parse(self, rep_raw: bytes) -> ReplayInfo: ...
