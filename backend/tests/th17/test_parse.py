from pathlib import Path
import unittest

from backend.src.games.th17.th17_parser import TH17Parser
from backend.tests.replay_checks import check_replay


class TestTH17Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH17Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th17_04_st5_prac.rpy",
            "th17_15_spell_card.rpy",
            "th17_17_full_game.rpy",
            "th17_25_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
