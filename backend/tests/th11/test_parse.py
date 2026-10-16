from pathlib import Path
import unittest

from backend.src.games.th11.th11_parser import TH11Parser
from backend.tests.replay_checks import check_replay


class TestTH11Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH11Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th11_01_st3_prac.rpy",
            "th11_05_extra.rpy",
            "th11_07_full_game.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
