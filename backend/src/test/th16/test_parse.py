from games.th16.th16_parser import TH16Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH16Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th16_02_extra.rpy")
test_parse_replay(parser, this_path / "th16_03_full_game.rpy")
test_parse_replay(parser, this_path / "th16_19_spell_card.rpy")
