from pathlib import Path
import unittest

from backend.src.games.th14.th14_parser import TH14Parser
from backend.tests.replay_checks import check_replay


class TestTH14Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH14Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th14_01_full_game.rpy",
            "th14_04_spell_card.rpy",
            "th14_07_st4_prac.rpy",
            "th14_14_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
