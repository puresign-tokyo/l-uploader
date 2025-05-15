from games.th08.th08_parser import Th08Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th08Parser()
this_path=Path(__file__).resolve().parent



test_parse_replay(parser, this_path/"th8_08_st3_prac.rpy")
test_parse_replay(parser, this_path/"th8_14_full_game.rpy")
test_parse_replay(parser, this_path/"th8_07_spell_card.rpy")
test_parse_replay(parser, this_path/"th8_06_extra.rpy")