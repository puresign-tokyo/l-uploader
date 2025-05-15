from games.th13.th13_parser import Th13Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th13Parser()
this_path=Path(__file__).resolve().parent

test_parse_replay(parser, this_path/"th13_13_full_game.rpy")
test_parse_replay(parser, this_path/"th13_14_st3_prac.rpy")
test_parse_replay(parser, this_path/"th13_15_extra.rpy")
test_parse_replay(parser, this_path/"th13_24_spell_card.rpy")