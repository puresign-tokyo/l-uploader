import { useTableUtils } from "./TableUtils";

interface AlcoReplay {
  replay_id: string;
  game_id: string;
  user_name: string;
  uploaded_at: string;
  upload_comment: string;
  category: string;
  optional_tag: string;
  filename: string;
  replay_meta: {
    name: string;
    total_score: string;
    slowdown: string;
    timestamp: string;
    stage_details: [];
    parser_version: string;
  };
}

export function AlcoTable(replay: AlcoReplay) {
  return {
    game_meta: {
      theme_color: "#C89600",
      img: {
        thumb: "/images/thumb/alco.png",
        full: "/images/full/alco.png",
        alt: "alco",
      },
      name: "黄昏酒場 〜Uwabami Breakers～",
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: Number(replay.replay_meta.slowdown).toFixed(2) + "%",
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    difficulty: null,
    shot_type: null,
    optional_division: null,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType("full_game"),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id,
    stage_details: {
      headers: [],
      items: [],
    },
  };
}
