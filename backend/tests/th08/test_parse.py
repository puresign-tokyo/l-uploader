from pathlib import Path
import unittest

from backend.src.games.th08.th08_parser import TH08Parser
from backend.tests.replay_checks import check_replay


class TestTH08Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH08Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th8_08_st3_prac.rpy",
            "th8_14_full_game.rpy",
            "th8_07_spell_card.rpy",
            "th8_06_extra.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
