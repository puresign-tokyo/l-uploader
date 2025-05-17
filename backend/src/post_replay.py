from parsers.parser_registry import ParserRegistry

# TODO いつか個々の作品を import するのをなくしたい
from games.th06.th06_parser import TH06Parser
from games.th07.th07_parser import TH07Parser
from games.th08.th08_parser import TH08Parser
from games.th09.th09_parser import TH09Parser
from games.th10.th10_parser import TH10Parser
from games.th11.th11_parser import TH11Parser
from games.th12.th12_parser import TH12Parser
from games.th13.th13_parser import TH13Parser
from games.th14.th14_parser import TH14Parser
from games.th15.th15_parser import TH15Parser
from games.th16.th16_parser import TH16Parser
from games.th17.th17_parser import TH17Parser
from games.th18.th18_parser import TH18Parser
from games.th128.th128_parser import TH128Parser


import json


def post_replay(rep_raw: bytes):
    parser = ParserRegistry.identify_parser(rep_raw)
    rep_info = parser.parse(rep_raw)
    print(json.dumps(rep_info.convert_to_dict(), indent=2))
