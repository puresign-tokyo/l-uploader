import { useTableUtils } from "./TableUtils";

const shotTypeMap: Record<string, { label: string; color: string }> = {
  ReimuA: {
    label: "霊夢A",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  ReimuB: {
    label: "霊夢B",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  MarisaA: {
    label: "魔理沙A",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
  MarisaB: {
    label: "魔理沙B",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
};
function convertShotType(shot_type_id: string) {
  return shotTypeMap[shot_type_id] || { label: "Unknown", color: "white" };
}

interface Th06Replay {
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
    shot_type: string;
    difficulty: string;
    total_score: string;
    timestamp: string;
    slowdown: string;
    replay_type: string;
    stage_details: [
      {
        stage: string;
        score: string | null;
        power: string | null;
        lives: string | null;
        bombs: string | null;
        rank: string | null;
      }
    ];
  };
}

export function Th06Table(replay: Th06Replay) {
  return {
    game_meta: {
      theme_color: "#993333",
      img: {
        thumb: "/images/thumb/th06.png",
        full: "/images/full/th06.png",
        alt: "th06",
      },
      name: "東方紅魔郷 〜 the Embodiment of Scarlet Devil.",
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
    // 年月日の情報しか入っていない
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    difficulty: useTableUtils().convertDifficulty(
      replay.replay_meta.difficulty
    ),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: null,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(
      replay.replay_meta.replay_type
    ),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id,
    stage_details: {
      headers: [
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
        },
        {
          title: "残機",
          key: "lives",
          sortable: false,
        },
        {
          title: "ボム",
          key: "bombs",
          sortable: false,
        },
        {
          title: "パワー",
          key: "power",
          sortable: false,
        },
        {
          title: "ランク",
          key: "rank",
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map((stage) => ({
        stage: String(stage.stage) !== "7" ? stage.stage : "Ex",
        score:
          stage.score !== null ? Number(stage.score).toLocaleString() : "-",
        power: stage.power ?? "-",
        lives: stage.lives ?? "-",
        bombs: stage.bombs ?? "-",
        rank: stage.rank ?? "-",
      })),
    },
  };
}
