from games.th14.th14_parser import Th14Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th14Parser()
this_path=Path(__file__).resolve().parent

test_parse_replay(parser, this_path/"th14_01_full_game.rpy")
test_parse_replay(parser, this_path/"th14_04_spell_card.rpy")
test_parse_replay(parser, this_path/"th14_07_st4_prac.rpy")
test_parse_replay(parser, this_path/"th14_14_extra.rpy")