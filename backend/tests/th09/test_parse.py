from pathlib import Path
import unittest

from backend.src.games.th09.th09_parser import TH09Parser
from backend.tests.replay_checks import check_replay


class TestTH09Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH09Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th9_01_vs_cpu2.rpy",
            "th9_02_extra.rpy",
            "th9_04_lunatic.rpy",
            "th9_18_pvp.rpy",
            "th9_20_vs_cpu1.rpy",
            "th9_05_cpu_vs_cpu.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
