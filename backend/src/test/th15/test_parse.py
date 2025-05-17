from games.th15.th15_parser import TH15Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay

parser = TH15Parser()
this_path = Path(__file__).resolve().parent

test_parse_replay(parser, this_path / "th15_05_st5_prac.rpy")
test_parse_replay(parser, this_path / "th15_08_extra.rpy")
test_parse_replay(parser, this_path / "th15_21_full_game.rpy")
