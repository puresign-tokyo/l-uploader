from typing import TYPE_CHECKING, Type
from typing import Optional, TypedDict, cast

if TYPE_CHECKING:
    from parsers.base_parser import BaseParser
    from backend.src.base_database_handler import BaseDatabaseHandler


class GamePreEntry(TypedDict, total=False):
    # 登録作業中はNoneである瞬間があり、Pylanceが怒る
    # 登録作業が終わったら全ての項目がNoneでなくなっているはず
    parser: Optional["BaseParser"]
    database_handler: Optional["BaseDatabaseHandler"]


class GameEntry(TypedDict):
    parser: "BaseParser"
    database_handler: "BaseDatabaseHandler"


class GameRegistry:
    _instance: "GameRegistry"
    _games: "dict[str,GamePreEntry]" = {}

    def __new__(cls) -> "GameRegistry":
        if not hasattr(cls, "_instance"):
            cls._instance = super(GameRegistry, cls).__new__(cls)
        return cls._instance

    @classmethod
    def check_key_in_games(cls, key):
        if key not in GameRegistry._games:
            GameRegistry._games[key] = {}

    # Noneチェックを兼ねているので必ずこの関数を通して_gameは触ること
    @classmethod
    def get_game_with_none_check(cls, game_id) -> "GameEntry":
        parser = GameRegistry._games[game_id].get("parser")
        database_handler = GameRegistry._games[game_id].get("database_handler")
        if parser is None:
            raise ValueError(f"parser of {game_id} is not defineded")
        if database_handler is None:
            raise ValueError(f"database_handler of {game_id} is not defineded")
        return cast(GameEntry, GameRegistry._games[game_id])

    @classmethod
    def add_parser(cls, parser_type: "Type[BaseParser]") -> None:
        from parsers.base_parser import BaseParser

        if not isinstance(parser_type, type):
            raise TypeError(f"{parser_type} must be class")
        if not issubclass(parser_type, BaseParser):
            raise TypeError(f"{parser_type} must be subclass of BaseParser")

        GameRegistry.check_key_in_games(parser_type().get_supported_game_id())
        GameRegistry._games[parser_type().get_supported_game_id()][
            "parser"
        ] = parser_type()

    @classmethod
    def add_database_handler(
        cls, database_handler_type: "Type[BaseDatabaseHandler]"
    ) -> None:
        from backend.src.base_database_handler import BaseDatabaseHandler

        if not isinstance(database_handler_type, type):
            raise TypeError(f"{database_handler_type} must be class")
        if not issubclass(database_handler_type, BaseDatabaseHandler):
            raise TypeError(
                f"{database_handler_type} must be subclass of BaseDatabaseHandler"
            )
        GameRegistry.check_key_in_games(database_handler_type().get_supported_game_id())
        GameRegistry._games[database_handler_type().get_supported_game_id()][
            "database_handler"
        ] = database_handler_type()

    @classmethod
    def identify_with_replayfile(cls, rep_raw: bytes) -> GameEntry:
        for game_id in GameRegistry._games.keys():
            game = GameRegistry.get_game_with_none_check(game_id)
            if game["parser"].can_parse(rep_raw):
                return game

        raise ValueError(
            f"Unsupported replay file format. File magic value: {rep_raw[:4].decode("utf-8")}. For th13/th14, metadata check failed to identify the game."
        )
