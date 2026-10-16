from pathlib import Path
import unittest

from backend.src.games.th128.th128_parser import TH128Parser
from backend.tests.replay_checks import check_replay


class TestTH128Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH128Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th128_01_extra.rpy",
            "th128_02_b1.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
