from typing import TYPE_CHECKING, Type

if TYPE_CHECKING:
    from parsers.base_parser import BaseParser


class ParserRegistry:
    _instance: "ParserRegistry"
    _parsers: "list[BaseParser]" = []

    def __new__(cls) -> "ParserRegistry":
        if not hasattr(cls, "_instance"):
            cls._instance = super(ParserRegistry, cls).__new__(cls)
        return cls._instance

    @classmethod
    def add_parser(cls, parser_type: "Type[BaseParser]") -> None:
        from parsers.base_parser import BaseParser

        if not isinstance(parser_type, type):
            raise TypeError(f"{parser_type} must be class")
        if not issubclass(parser_type, BaseParser):
            raise TypeError(f"{parser_type} must be subclass of BaseParser")
        ParserRegistry._parsers.append(parser_type())

    @classmethod
    def identify_parser(cls, rep_raw: bytes) -> "BaseParser":
        for parser in ParserRegistry._parsers:
            if parser.can_parse(rep_raw):
                return parser
        raise ValueError(
            f"Unsupported Touhou replay file format. File magic value: {rep_raw[:4].decode("utf-8")}. For th13/th14, metadata check failed to identify the game."
        )
