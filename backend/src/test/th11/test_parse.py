from games.th11.th11_parser import TH11Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH11Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th11_01_st3_prac.rpy")
test_parse_replay(parser, this_path / "th11_05_extra.rpy")
test_parse_replay(parser, this_path / "th11_07_full_game.rpy")
