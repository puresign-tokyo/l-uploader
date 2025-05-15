from games.th12.th12_parser import Th12Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th12Parser()
this_path=Path(__file__).resolve().parent

test_parse_replay(parser, this_path/"th12_02_full_game.rpy")
test_parse_replay(parser, this_path/"th12_07_st5_fail.rpy")
test_parse_replay(parser, this_path/"th12_ud1029_extra.rpy")