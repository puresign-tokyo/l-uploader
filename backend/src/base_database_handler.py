from abc import ABC, abstractmethod
from replay_info import ReplayInfo
from psycopg import Cursor


class BaseDatabaseHandler(ABC):
    _instances = {}

    def __init_subclass__(cls) -> None:
        from game_registry import GameRegistry

        GameRegistry.add_database_handler(cls)

        def singleton_new(cls, *args, **kwargs):
            if cls not in BaseDatabaseHandler._instances:
                BaseDatabaseHandler._instances[cls] = super(
                    BaseDatabaseHandler, cls
                ).__new__(cls)
            return BaseDatabaseHandler._instances[cls]

        cls.__new__ = singleton_new

    @abstractmethod
    def get_supported_game_id(cls) -> str: ...

    @abstractmethod
    def insert_replay(cls, replay_id: str, replay_info: ReplayInfo): ...
