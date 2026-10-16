from pathlib import Path
import unittest

from backend.src.games.th12.th12_parser import TH12Parser
from backend.tests.replay_checks import check_replay


class TestTH12Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH12Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th12_02_full_game.rpy",
            "th12_07_st5_fail.rpy",
            "th12_ud1029_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
