from pathlib import Path
import unittest

from backend.src.games.th18.th18_parser import TH18Parser
from backend.tests.replay_checks import check_replay


class TestTH18Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH18Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th18_04_extra.rpy",
            "th18_18_full_game.rpy",
            "th18_24_st4_prac.rpy",
            "th18_25_spell_card.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
