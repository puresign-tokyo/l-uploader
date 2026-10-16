from pathlib import Path
import unittest

from backend.src.games.th10.th10_parser import TH10Parser
from backend.tests.replay_checks import check_replay


class TestTH10Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH10Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th10_01_full_game.rpy",
            "th10_10_st4_prac.rpy",
            "th10_18_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
