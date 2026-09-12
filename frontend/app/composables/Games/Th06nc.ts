import { useTableUtils } from "./TableUtils";

const spellCardMap: Record<string, { ja: string; en: string }> = {
  1: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  2: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  3: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  4: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  5: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  6: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  7: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  8: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  9: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  10: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  11: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  12: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  13: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  14: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  15: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  16: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  17: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  18: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  19: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  20: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  21: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  22: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  23: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  24: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  25: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  26: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  27: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  28: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  29: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  30: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  31: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  32: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  33: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  34: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  35: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  36: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  37: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  38: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  39: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  40: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  41: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  42: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  43: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  44: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  45: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  46: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  47: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  48: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  49: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  50: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  51: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  52: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  53: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  54: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  55: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  56: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  57: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  58: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  59: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  60: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  61: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  62: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  63: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  64: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  65: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  66: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  67: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  68: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  69: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  70: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  71: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  72: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  73: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  74: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  75: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  76: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  77: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  78: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  79: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  80: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  81: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  82: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  83: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  84: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  85: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  86: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  87: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  88: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  89: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  90: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  91: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  92: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  93: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  94: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  95: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  96: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  97: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  98: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  99: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  100: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  101: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  102: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  103: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  104: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  105: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  106: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  107: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  108: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  109: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  110: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  111: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  112: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  113: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  114: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  115: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  116: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  117: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  118: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  119: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  120: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  121: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  122: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  123: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  124: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  125: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  126: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  127: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  128: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  129: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  130: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  131: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  132: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  133: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
  134: { ja: "スペカ名対応予定", en: "スペカ名対応予定" },
};
function convertSpellCard(spell_card_id: string) {
  return spellCardMap[spell_card_id] ?? { ja: "不明", en: "Unknown" };
}

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
    spell_card_id: string;
    stage_details: [
      {
        stage: string;
        score: string | null;
        power: string | null;
        lives: string | null;
        bombs: string | null;
        misses: string | null;
      },
    ];
  };
}

export function Th06ncTable(replay: Th06Replay) {
  let optional_division = null;
  if (replay.replay_meta.replay_type === "spell_card") {
    optional_division = {
      label: convertSpellCard(replay.replay_meta.spell_card_id).ja,
      color: "light-blue-darken-3",
    };
  }

  return {
    game_meta: {
      theme_color: "#CA6767",
      img: {
        thumb: "/images/thumb/th06nc.png",
        full: "/images/full/th06nc.png",
        alt: "th06",
      },
      name: "東方紅魔郷 〜 the Embodiment of Scarlet Devil: New Classic",
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
    difficulty:
      Number(replay.replay_meta.difficulty) === -1
        ? { label: "難易度無し", color: "grey" }
        : useTableUtils().convertDifficulty(replay.replay_meta.difficulty),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: optional_division,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(
      replay.replay_meta.replay_type,
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
          title: "ミス数",
          key: "misses",
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
        rank: stage.misses ?? "-",
      })),
    },
  };
}
