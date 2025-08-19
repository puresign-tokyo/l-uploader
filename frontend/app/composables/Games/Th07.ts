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
  SakuyaA: {
    label: "咲夜A",
    color: useTableUtils().convertCharacter("Sakuya").color,
  },
  SakuyaB: {
    label: "咲夜B",
    color: useTableUtils().convertCharacter("Sakuya").color,
  },
};

function convertShotType(shot_type_id: string) {
  return shotTypeMap[shot_type_id] || { label: "Unknown", color: "white" };
}

interface Th07Replay {
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
        point_items: string | null;
        graze: string | null;
        piv: string | null;
        cherry: string | null;
        cherry_max: string | null;
        power: string | null;
        lives: string | null;
        bombs: string | null;
      }
    ];
  };
}

export function Th07Table(replay: Th07Replay) {
  let difficulty;
  if (Number(replay.replay_meta.difficulty) === 5) {
    difficulty = { label: "Phantasm", color: "cyan darken-2" };
  } else {
    difficulty = useTableUtils().convertDifficulty(
      replay.replay_meta.difficulty
    );
  }
  return {
    game_meta: {
      theme_color: "#FF75DD",
      img: {
        thumb: "/images/thumb/th07.png",
        full: "/images/full/th07.png",
        alt: "th07",
      },
      name: "東方妖々夢 〜 Perfect Cherry Blossom.",
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
    // 月日の情報しか入っていない
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
    }),
    difficulty: difficulty,
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
          title: "桜＋",
          key: "cherry",
          sortable: false,
        },
        {
          title: "桜分子",
          key: "piv",
          sortable: false,
        },
        {
          title: "桜分母",
          key: "cherry_max",
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map((stage) => {
        let stageLabel: string;

        switch (String(stage.stage)) {
          case "7":
            stageLabel = "Ex";
            break;
          case "8":
            stageLabel = "Ph";
            break;
          default:
            stageLabel = stage.stage;
        }
        return {
          stage: stageLabel,
          score:
            stage.score !== null ? Number(stage.score).toLocaleString() : "-",
          power: stage.power ?? "-",
          lives: stage.lives ?? "-",
          bombs: stage.bombs ?? "-",
          cherry:
            stage.cherry !== null ? Number(stage.cherry).toLocaleString() : "-",
          piv: stage.piv !== null ? Number(stage.piv).toLocaleString() : "-",
          cherry_max:
            stage.cherry_max !== null
              ? Number(stage.cherry_max).toLocaleString()
              : "-",
        };
      }),
    },
  };
}
