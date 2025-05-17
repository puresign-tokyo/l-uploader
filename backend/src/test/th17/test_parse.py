from games.th17.th17_parser import TH17Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH17Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th17_04_st5_prac.rpy")
test_parse_replay(parser, this_path / "th17_15_spell_card.rpy")
test_parse_replay(parser, this_path / "th17_17_full_game.rpy")
test_parse_replay(parser, this_path / "th17_25_extra.rpy")
