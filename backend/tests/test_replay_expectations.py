"""Data-driven replay assertions shared by all games."""

import importlib
from pathlib import Path
import unittest

import yaml

from backend.src.game_registry import GameRegistry
from backend.tests.expectation_checks import assert_matches


TEST_DIR = Path(__file__).resolve().parent
REPLAY_DIR = TEST_DIR / "replays"
EXPECTATIONS_FILE = TEST_DIR / "replay_expectations.yaml"


class TestReplayExpectations(unittest.TestCase):
    def test_replay_parse(self):
        with EXPECTATIONS_FILE.open(encoding="utf-8") as stream:
            document = yaml.safe_load(stream)
        self.assertIsInstance(document, dict, str(EXPECTATIONS_FILE))
        self.assertIn("test_replay_parse", document)
        cases = document["test_replay_parse"]
        self.assertIsInstance(cases, dict)
        self.assertTrue(cases, "test_replay_parse must contain at least one case")

        # Register parsers without importing the API app or connecting to databases.
        games_dir = TEST_DIR.parent / "src" / "games"
        for parser_path in sorted(games_dir.glob("*/*_parser.py")):
            importlib.import_module(
                f"backend.src.games.{parser_path.parent.name}.{parser_path.stem}"
            )

        covered = set()
        for name, case in cases.items():
            with self.subTest(case=name):
                self.assertIsInstance(case, dict)
                self.assertTrue({"replay_file", "expect"} <= set(case))
                self.assertTrue(set(case) <= {"replay_file", "expect", "exact"})
                exact = case.get("exact", False)
                self.assertIs(type(exact), bool)
                filename = case["replay_file"]
                self.assertIsInstance(filename, str)
                self.assertEqual(Path(filename).name, filename, "Use a replay filename, not a path")
                replay_path = REPLAY_DIR / filename
                self.assertTrue(replay_path.is_file(), f"Missing replay: {replay_path}")
                covered.add(filename)
                expected = case["expect"]
                self.assertIsInstance(expected, (dict, list))
                self.assertTrue(expected, f"{name}: expect must not be empty")
                raw = replay_path.read_bytes()
                parser = GameRegistry.identify_with_replayfile(raw)["parser"]
                actual = parser.parse(raw).convert_to_dict()
                # The short list form means selected stage_details assertions.
                if isinstance(expected, list):
                    expected = {"stage_details": expected}
                assert_matches(self, actual, expected, f"{name}({filename})", exact=exact)

        self.assertEqual(
            covered,
            {path.name for path in REPLAY_DIR.glob("*.rpy")},
            "Every replay fixture must have a YAML expectation case",
        )
