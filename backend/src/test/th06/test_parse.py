from games.th06.th06_parser import TH06Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH06Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th6_02_st3_prac.rpy")
test_parse_replay(parser, this_path / "th6_15_full_game.rpy")
test_parse_replay(parser, this_path / "th6_ud_extra.rpy")
