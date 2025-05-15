from games.th09.th09_parser import Th09Parser
from pathlib import Path
from parsers.test_parse import test_parse_replay
parser=Th09Parser()
this_path=Path(__file__).resolve().parent


test_parse_replay(parser, this_path/"th9_01_vs_cpu2.rpy")
test_parse_replay(parser, this_path/"th9_02_extra.rpy")
test_parse_replay(parser, this_path/"th9_04_lunatic.rpy")
test_parse_replay(parser, this_path/"th9_18_pvp.rpy")
test_parse_replay(parser, this_path/"th9_20_vs_cpu1.rpy")
test_parse_replay(parser, this_path/"th9_05_cpu_vs_cpu.rpy")