from pathlib import Path
import unittest

from backend.src.games.th15.th15_parser import TH15Parser
from backend.tests.replay_checks import check_replay


class TestTH15Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH15Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th15_05_st5_prac.rpy",
            "th15_08_extra.rpy",
            "th15_21_full_game.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
