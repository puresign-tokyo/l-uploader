from pathlib import Path
import unittest

from backend.src.games.th13.th13_parser import TH13Parser
from backend.tests.replay_checks import check_replay


class TestTH13Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH13Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th13_13_full_game.rpy",
            "th13_14_st3_prac.rpy",
            "th13_15_extra.rpy",
            "th13_24_spell_card.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
