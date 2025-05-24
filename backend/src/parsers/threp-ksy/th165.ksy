meta:
  id: th165
  file-extension: rpy
  endian: le
seq:
  - id: main
    type: main
  - id: userdata
    type: userdata
types:
  main:
    seq:
      - id: magic_ver
        contents: t156
      - id: version
        type: u4
      - id: unused_1
        type: u4
      - id: userdata_offset
        type: u4
      - id: unused_2
        size: 12
      - id: comp_size
        type: u4
      - id: size
        type: u4
      - id: comp_data
        size: comp_size
  userdata:
    seq:
      - id: magic_user
        contents: USER
      - id: user_length
        type: u4
      - id: unknown
        size: 4
      - id: user_desc
        type: u1
        repeat: until
        repeat-until: _ == 0xd
      - id: user_desc_term
        type: str
        terminator: 0xa
        encoding: ASCII
      - id: user_ver
        type: userdata_field("Version")
      - id: name
        type: userdata_field("Name")
      - id: date
        type: userdata_field("Date")
      - id: level
        type: userdata_field("Day")
      - id: scene
        type: userdata_field("Scene")
      - id: invalid_score
        type: userdata_field("Score")
      - id: slowdown
        type: userdata_field("Slow Rate")
  crlfstring:
    seq:
      - id: value
        type: str
        terminator: 0xd
        encoding: SJIS
      - id: term
        type: u1
  userdata_field:
    params:
      - id: expected_name
        type: str
    seq:
      - id: name
        type: str
        size: expected_name.length
        encoding: ASCII
        valid: expected_name
      - id: name_value_separator_space
        contents: " "
      - id: value_with_space
        type: str
        # Always ends with 0x0d0a; that is, space then LF
        terminator: 0x0a
        encoding: ASCII
    instances:
      value:
        value: value_with_space.substring(0, value_with_space.length - 1)