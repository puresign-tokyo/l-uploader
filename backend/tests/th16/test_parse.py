from pathlib import Path
import unittest

from backend.src.games.th16.th16_parser import TH16Parser
from backend.tests.replay_checks import check_replay


class TestTH16Parser(unittest.TestCase):
    def test_parse_replays(self):
        parser = TH16Parser()
        fixture_dir = Path(__file__).resolve().parent
        for filename in (
            "th16_02_extra.rpy",
            "th16_03_full_game.rpy",
            "th16_19_spell_card.rpy",
        ):
            with self.subTest(replay=filename):
                check_replay(self, parser, fixture_dir / filename)
