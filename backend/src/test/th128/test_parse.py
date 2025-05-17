from games.th128.th128_parser import TH128Parser
from pathlib import Path

parser = TH128Parser()
this_path = Path(__file__).resolve().parent

with open(this_path / "th128_01_extra.rpy", "rb") as f:
    rep = f.read()
    rep_parse = parser.parse(rep)
    rep_dict = rep_parse.convert_to_dict()
    print(rep_dict)

with open(this_path / "th128_02_b1.rpy", "rb") as f:
    rep = f.read()
    rep_parse = parser.parse(rep)
    rep_dict = rep_parse.convert_to_dict()
    print(rep_dict)
