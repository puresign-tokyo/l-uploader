def Parse(replay_binary):
    parser = identify_parser(replay_binary)
    replay_info = parser().parse(replay_binary)
