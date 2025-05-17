from parsers.base_parser import BaseParser
from pathlib import Path
import json

def test_parse_replay(parser: BaseParser, filename: Path):
    with open(filename,"rb") as f:
        rep=f.read()
        rep_parse=parser.parse(rep)
        rep_dict=rep_parse.convert_to_dict()
        
        print("")
        print(filename)
        print(json.dumps(rep_dict, indent=2))