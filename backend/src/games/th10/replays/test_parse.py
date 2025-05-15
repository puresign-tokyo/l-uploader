from games.th10.th10_parser import Th10Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th10Parser()
this_path=Path(__file__).resolve().parent

test_parse_replay(parser, this_path/"th10_01_full_game.rpy")
test_parse_replay(parser, this_path/"th10_10_st4_prac.rpy")
test_parse_replay(parser, this_path/"th10_18_extra.rpy")