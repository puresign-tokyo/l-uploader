"""Shared checks for replay parser fixtures."""

import json
from pathlib import Path
from unittest import TestCase

from backend.src.parsers.base_parser import BaseParser


def check_replay(test: TestCase, parser: BaseParser, path: Path) -> None:
    replay = parser.parse(path.read_bytes())
    result = replay.convert_to_dict()
    test.assertIsInstance(result, dict)
    test.assertTrue(result)
    # The API must be able to serialize the converted replay data.
    json.dumps(result)
