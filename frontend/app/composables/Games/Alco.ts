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
    stage_details: [
      // パーサバージョン2で追加
      {
        stage: string;
        score: string | null;
      }
    ];
    parser_version: string;
  };
}

interface StageDetailHeader {
  title: string;
  key: string;
  sortable: boolean;
  fixed: boolean;
}

interface StageDetailItem {
  stage: string;
  score: string;
}

export function AlcoTable(replay: AlcoReplay) {
  let parser_version = Number(replay.replay_meta.parser_version);

  let stage_detail_headers: StageDetailHeader[] = [];
  let stage_detail_items: StageDetailItem[] = [];
  if (parser_version >= 2) {
    stage_detail_headers = [
      {
        title: "ステージ",
        key: "stage",
        sortable: false,
        fixed: true,
      },
      {
        title: "スコア",
        key: "score",
        sortable: false,
        fixed: false,
      },
    ];
    stage_detail_items = replay.replay_meta.stage_details.map((stage) => ({
      stage: String(stage.stage),
      score: stage.score !== null ? Number(stage.score).toLocaleString() : "-",
    }));
  }

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
      headers: stage_detail_headers,
      items: stage_detail_items,
    },
  };
}
