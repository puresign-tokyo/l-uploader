from games.th07.th07_parser import Th07Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th07Parser()
this_path=Path(__file__).resolve().parent

test_parse_replay(parser, this_path/"th7_09_extra.rpy")
test_parse_replay(parser, this_path/"th7_10_st4_prac.rpy")
test_parse_replay(parser, this_path/"th7_11_full_game.rpy")