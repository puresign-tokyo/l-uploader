from pathlib import Path
import unittest

from backend.src.games.th06.th06_parser import TH06Parser
from backend.tests.replay_checks import check_replay


class TestTH06Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH06Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th6_02_st3_prac.rpy",
            "th6_15_full_game.rpy",
            "th6_ud_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
