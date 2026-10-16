from pathlib import Path
import unittest

from backend.src.games.th07.th07_parser import TH07Parser
from backend.tests.replay_checks import check_replay


class TestTH07Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH07Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th7_09_extra.rpy",
            "th7_10_st4_prac.rpy",
            "th7_11_full_game.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
