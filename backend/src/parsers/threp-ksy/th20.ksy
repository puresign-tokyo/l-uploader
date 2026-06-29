meta:
  id: th20
  file-extension: raw
  endian: le
seq:
  - id: header
    type: header
  - id: stages
    type: stage
    repeat: expr
    repeat-expr: header.stage_count
types:
  header:
    seq:
      - id: name
        type: str
        size: 16
        terminator: 0
        encoding: Shift_JIS
      - id: timestamp
        type: u8
      - id: score
        type: u4
      - id: unknown_1
        size: 180
      - id: slowdown
        type: f4
      - id: stage_count
        type: u4
      - id: shot # 0 is Reimu, 1 is Marisa
        type: u4
      # 0 red, 1 red2, 2 blue, 3 blue2, 4 yellow, 5 yellow2, 6 green, 7 green2, 8 default (sub only)
      - id: stones
        type: u4
        repeat: expr
        repeat-expr: 4
      - id: unknown_2
        size: 4
      - id: difficulty
        type: u4
      - id: unknown_3
        size: 4
      - id: unknown_4
        size: 4
      - id: spell_practice_id
        type: u4
  stage:
    seq:
      - id: stage_num
        type: u2
      - id: unknown_before_len_stage_data
        size: 10
      - id: len_stage_data
        type: u4

      - id: unknown_0
        size: 0x60

      - id: score
        type: u4

      - id: unknown_1
        size: 0x2c

      - id: power
        type: u4

      - id: unknown_2
        size: 0x10

      - id: piv
        type: u4

      - id: unknown_3
        size: 0x04

      - id: hyper
        type: u4

      - id: unknown_4
        size: 0x34

      - id: red
        type: u4
      - id: blue
        type: u4
      - id: yellow
        type: u4
      - id: green
        type: u4

      - id: total_stone_count
        type: u4

      - id: unknown_5
        size: 0x20

      - id: lives
        type: u4
      - id: unknown_6
        size: 0x04
      - id: life_pieces
        type: u4
      - id: unknown_7
        size: 0x08
      - id: bombs
        type: u4
      - id: bomb_pieces
        type: u4

      - id: unknown_8
        size: 0x15c

      - id: stage_data
        size: len_stage_data
