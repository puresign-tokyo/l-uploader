from games.th18.th18_parser import TH18Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH18Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th18_04_extra.rpy")
test_parse_replay(parser, this_path / "th18_18_full_game.rpy")
test_parse_replay(parser, this_path / "th18_24_st4_prac.rpy")
test_parse_replay(parser, this_path / "th18_25_spell_card.rpy")
