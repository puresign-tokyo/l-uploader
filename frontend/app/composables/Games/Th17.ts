import { useTableUtils } from "./TableUtils";

const spellCardMap: Record<string, { ja: string; en: string }> = {
  0: { ja: "石符「ストーンウッズ」", en: 'Stone Sign "Stone Woods"' },
  1: { ja: "石符「ストーンウッズ」", en: 'Stone Sign "Stone Woods"' },
  2: { ja: "石符「ストーンコニファー」", en: 'Stone Sign "Stone Conifers"' },
  3: { ja: "石符「ストーンコニファー」", en: 'Stone Sign "Stone Conifers"' },
  4: { ja: "石符「チルドレンズリンボ」", en: 'Stone Sign "Children\'s Limbo"' },
  5: { ja: "石符「チルドレンズリンボ」", en: 'Stone Sign "Children\'s Limbo"' },
  6: {
    ja: "石符「アダルトチルドレンズリンボ」",
    en: 'Stone Sign "Adult Children\'s Limbo"',
  },
  7: {
    ja: "石符「アダルトチルドレンズリンボ」",
    en: 'Stone Sign "Adult Children\'s Limbo"',
  },
  8: { ja: "石符「ストーンベイビー」", en: 'Stone Sign "Stone Baby"' },
  9: { ja: "石符「ストーンベイビー」", en: 'Stone Sign "Stone Baby"' },
  10: {
    ja: "石符「ヘビーストーンベイビー」",
    en: 'Stone Sign "Heavy Stone Baby"',
  },
  11: {
    ja: "石符「ヘビーストーンベイビー」",
    en: 'Stone Sign "Heavy Stone Baby"',
  },
  12: { ja: "溺符「三途の淪溺」", en: 'Drowning Sign "Drowning in the Sanzu"' },
  13: { ja: "溺符「三途の淪溺」", en: 'Drowning Sign "Drowning in the Sanzu"' },
  14: { ja: "溺符「三途の淪溺」", en: 'Drowning Sign "Drowning in the Sanzu"' },
  15: { ja: "溺符「三途の淪溺」", en: 'Drowning Sign "Drowning in the Sanzu"' },
  16: { ja: "鬼符「デーモンシージ」", en: 'Oni Sign "Demon Siege"' },
  17: { ja: "鬼符「デーモンシージ」", en: 'Oni Sign "Demon Siege"' },
  18: {
    ja: "鬼符「ハングリーデーモンシージ」",
    en: 'Oni Sign "Hungry Demon Siege"',
  },
  19: {
    ja: "鬼符「ハングリーデーモンシージ」",
    en: 'Oni Sign "Hungry Demon Siege"',
  },
  20: {
    ja: "水符「水配りの試練」",
    en: 'Water Sign "Ordeal of Water Distribution"',
  },
  21: {
    ja: "水符「水配りの試練」",
    en: 'Water Sign "Ordeal of Water Distribution"',
  },
  22: {
    ja: "水符「水配りの上級試煉」",
    en: 'Water Sign "High-Level Purgatordeal of Water Distribution"',
  },
  23: {
    ja: "水符「水配りの極級試煉」",
    en: 'Water Sign "Ultimate Purgatordeal of Water Distribution"',
  },
  24: { ja: "光符「見渡しの試練」", en: 'Light Sign "Ordeal of Surveying"' },
  25: { ja: "光符「見渡しの試練」", en: 'Light Sign "Ordeal of Surveying"' },
  26: {
    ja: "光符「見渡しの上級試煉」",
    en: 'Light Sign "High-Level Purgatordeal of Surveying"',
  },
  27: {
    ja: "光符「見渡しの極級試煉」",
    en: 'Light Sign "Ultimate Purgatordeal of Surveying"',
  },
  28: { ja: "鬼符「鬼渡の試練」", en: 'Oni Sign "Purgatordeal of Oniwatari"' },
  29: { ja: "鬼符「鬼渡の試練」", en: 'Oni Sign "Purgatordeal of Oniwatari"' },
  30: {
    ja: "鬼符「鬼渡の上級試煉」",
    en: 'Oni Sign "High-Level Purgatordeal of Oniwatari"',
  },
  31: {
    ja: "鬼符「鬼渡の獄級試煉」",
    en: 'Oni Sign "Hell-Level Purgatordeal of Oniwatari"',
  },
  32: { ja: "亀符「亀甲地獄」", en: 'Tortoise Sign "Tortoiseshell Hell"' },
  33: { ja: "亀符「亀甲地獄」", en: 'Tortoise Sign "Tortoiseshell Hell"' },
  34: { ja: "亀符「亀甲地獄」", en: 'Tortoise Sign "Tortoiseshell Hell"' },
  35: { ja: "亀符「亀甲地獄」", en: 'Tortoise Sign "Tortoiseshell Hell"' },
  36: {
    ja: "鬼符「搦手の畜生」",
    en: 'Oni Sign "Beasts Attacking from the Rear"',
  },
  37: {
    ja: "鬼符「搦手の畜生」",
    en: 'Oni Sign "Beasts Attacking from the Rear"',
  },
  38: {
    ja: "鬼符「搦手の犬畜生」",
    en: 'Oni Sign "Mangy Beasts Attacking from the Rear"',
  },
  39: {
    ja: "鬼符「搦手の鬼畜生」",
    en: 'Oni Sign "Devilish Beasts Attacking from the Rear"',
  },
  40: { ja: "龍符「龍紋弾」", en: 'Dragon Sign "Dragon Crest Bullets"' },
  41: { ja: "龍符「龍紋弾」", en: 'Dragon Sign "Dragon Crest Bullets"' },
  42: { ja: "龍符「龍紋弾」", en: 'Dragon Sign "Dragon Crest Bullets"' },
  43: { ja: "龍符「龍紋弾」", en: 'Dragon Sign "Dragon Crest Bullets"' },
  44: { ja: "埴輪「弓兵埴輪」", en: 'Haniwa "Archer Haniwa"' },
  45: { ja: "埴輪「弓兵埴輪」", en: 'Haniwa "Archer Haniwa"' },
  46: { ja: "埴輪「熟練弓兵埴輪」", en: 'Haniwa "Skilled Archer Haniwa"' },
  47: { ja: "埴輪「熟練弓兵埴輪」", en: 'Haniwa "Skilled Archer Haniwa"' },
  48: { ja: "埴輪「剣士埴輪」", en: 'Haniwa "Fencer Haniwa"' },
  49: { ja: "埴輪「剣士埴輪」", en: 'Haniwa "Fencer Haniwa"' },
  50: { ja: "埴輪「熟練剣士埴輪」", en: 'Haniwa "Skilled Fencer Haniwa"' },
  51: { ja: "埴輪「熟練剣士埴輪」", en: 'Haniwa "Skilled Fencer Haniwa"' },
  52: { ja: "埴輪「騎馬兵埴輪」", en: 'Haniwa "Cavalry Haniwa"' },
  53: { ja: "埴輪「騎馬兵埴輪」", en: 'Haniwa "Cavalry Haniwa"' },
  54: { ja: "埴輪「熟練騎馬兵埴輪」", en: 'Haniwa "Skilled Cavalry Haniwa"' },
  55: { ja: "埴輪「熟練騎馬兵埴輪」", en: 'Haniwa "Skilled Cavalry Haniwa"' },
  56: {
    ja: "埴輪「がらんどうの無尽兵団」",
    en: 'Haniwa "Hollow Inexhaustible Troops"',
  },
  57: {
    ja: "埴輪「がらんどうの無尽兵団」",
    en: 'Haniwa "Hollow Inexhaustible Troops"',
  },
  58: {
    ja: "埴輪「不敗の無尽兵団」",
    en: 'Haniwa "Undefeated Inexhaustible Troops"',
  },
  59: {
    ja: "埴輪「不敗の無尽兵団」",
    en: 'Haniwa "Undefeated Inexhaustible Troops"',
  },
  60: {
    ja: "方形「方形造形術」",
    en: 'Square Shape "Square-Shaped Sculpting Art"',
  },
  61: {
    ja: "方形「方形造形術」",
    en: 'Square Shape "Square-Shaped Sculpting Art"',
  },
  62: {
    ja: "方形「スクエアクリーチャー」",
    en: 'Square Shape "Square Creature"',
  },
  63: {
    ja: "方形「スクエアクリーチャー」",
    en: 'Square Shape "Square Creature"',
  },
  64: {
    ja: "円形「真円造形術」",
    en: 'Circular Shape "Perfect Circle Sculpting Art"',
  },
  65: {
    ja: "円形「真円造形術」",
    en: 'Circular Shape "Perfect Circle Sculpting Art"',
  },
  66: {
    ja: "円形「サークルクリーチャー」",
    en: 'Circular Shape "Circle Creature"',
  },
  67: {
    ja: "円形「サークルクリーチャー」",
    en: 'Circular Shape "Circle Creature"',
  },
  68: {
    ja: "線形「線形造形術」",
    en: 'Linear Shape "Line-Shaped Sculpting Art"',
  },
  69: {
    ja: "線形「線形造形術」",
    en: 'Linear Shape "Line-Shaped Sculpting Art"',
  },
  70: {
    ja: "線形「リニアクリーチャー」",
    en: 'Linear Shape "Linear Creature"',
  },
  71: {
    ja: "線形「リニアクリーチャー」",
    en: 'Linear Shape "Linear Creature"',
  },
  72: {
    ja: "埴輪「偶像人馬造形術」",
    en: 'Haniwa "Horse-and-Rider Idol Sculpting Art"',
  },
  73: {
    ja: "埴輪「偶像人馬造形術」",
    en: 'Haniwa "Horse-and-Rider Idol Sculpting Art"',
  },
  74: { ja: "埴輪「アイドルクリーチャー」", en: 'Haniwa "Idol Creature"' },
  75: { ja: "埴輪「アイドルクリーチャー」", en: 'Haniwa "Idol Creature"' },
  76: { ja: "「鬼形造形術」", en: '"Oni-Shaped Sculpting Art"' },
  77: { ja: "「鬼形造形術」", en: '"Oni-Shaped Sculpting Art"' },
  78: { ja: "「鬼形造形術」", en: '"Oni-Shaped Sculpting Art"' },
  79: { ja: "「鬼形造形術」", en: '"Oni-Shaped Sculpting Art"' },
  80: { ja: "「ジオメトリッククリーチャー」", en: '"Geometric Creature"' },
  81: { ja: "「ジオメトリッククリーチャー」", en: '"Geometric Creature"' },
  82: { ja: "「ジオメトリッククリーチャー」", en: '"Geometric Creature"' },
  83: { ja: "「ジオメトリッククリーチャー」", en: '"Geometric Creature"' },
  84: { ja: "「イドラディアボルス」", en: '"Idola Diabolus"' },
  85: { ja: "「イドラディアボルス」", en: '"Idola Diabolus"' },
  86: { ja: "「イドラディアボルス」", en: '"Idola Diabolus"' },
  87: { ja: "「イドラディアボルス」", en: '"Idola Diabolus"' },
  88: { ja: "血戦「血の分水嶺」", en: 'Bloody Battle "Watershed of Blood"' },
  89: { ja: "血戦「獄界視線」", en: 'Bloody Battle "Hell Realm Sight-Line"' },
  90: { ja: "血戦「全霊鬼渡り」", en: 'Bloody Battle "All-Spirit Oniwatari"' },
  91: {
    ja: "勁疾技「スリリングショット」",
    en: 'Agile Skill "Thrilling Shot"',
  },
  92: { ja: "勁疾技「ライトニングネイ」", en: 'Agile Skill "Lightning Neigh"' },
  93: { ja: "勁疾技「デンスクラウド」", en: 'Agile Skill "Dense Crowd"' },
  94: {
    ja: "勁疾技「ビーストエピデミシティ」",
    en: 'Agile Skill "Beast Epidemicity"',
  },
  95: {
    ja: "勁疾技「トライアングルチェイス」",
    en: 'Agile Skill "Triangle Chase"',
  },
  96: {
    ja: "勁疾技「ブラックペガサス流星弾」",
    en: 'Agile Skill "Black Pegasus Meteor Shot"',
  },
  97: {
    ja: "勁疾技「マッスルエクスプロージョン」",
    en: 'Agile Skill "Muscle Explosion"',
  },
  98: { ja: "「フォロミーアンアフライド」", en: '"Follow Me, Unafraid"' },
  99: { ja: "「鬼形のホイポロイ」", en: '"Oni-Shaped Hoi Polloi"' },
  100: { ja: "「鬼畜生の所業」", en: '"Deeds of Devilish Beasts"' },
};

function convertSpellCard(spell_card_id: string) {
  return spellCardMap[spell_card_id] ?? { ja: "不明", en: "Unknown" };
}

const shotTypeMap: Record<string, { label: string; color: string }> = {
  ReimuWolf: {
    label: "霊夢(オオカミ)",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  ReimuOtter: {
    label: "霊夢(カワウソ)",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  ReimuEagle: {
    label: "霊夢(オオワシ)",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  MarisaWolf: {
    label: "魔理沙(オオカミ)",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
  MarisaOtter: {
    label: "魔理沙(カワウソ)",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
  MarisaEagle: {
    label: "魔理沙(オオワシ)",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
  YoumuWolf: {
    label: "妖夢(オオカミ)",
    color: useTableUtils().convertCharacter("Youmu").color,
  },
  YoumuOtter: {
    label: "妖夢(カワウソ)",
    color: useTableUtils().convertCharacter("Youmu").color,
  },
  YoumuEagle: {
    label: "妖夢(オオワシ)",
    color: useTableUtils().convertCharacter("Youmu").color,
  },
};

function convertShotType(shot_type_id: string) {
  return shotTypeMap[shot_type_id] || { label: "Unknown", color: "white" };
}

interface Th17Replay {
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
    slowdown: string;
    timestamp: string;
    replay_type: string;
    spell_card_id: string;
    stage_details: [
      {
        stage: string;
        score: string | null;
        power: string | null;
        piv: string | null;
        lives: string | null;
        life_pieces: string | null;
        bombs: string | null;
        bomb_pieces: string | null;
        graze: string | null;
      }
    ];
  };
}

export function Th17Table(replay: Th17Replay) {
  let optional_division = null;
  if (replay.replay_meta.replay_type === "spell_card") {
    optional_division = {
      label: convertSpellCard(replay.replay_meta.spell_card_id).ja,
      color: "light-blue-darken-3",
    };
  }

  return {
    game_meta: {
      theme_color: "#190E0E",
      img: {
        thumb: "/images/thumb/th17.png",
        full: "/images/full/th17.png",
        alt: "th17",
      },
      name: "東方鬼形獣 〜 Wily Beast and Weakest Creature.",
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
    difficulty: useTableUtils().convertDifficulty(
      replay.replay_meta.difficulty
    ),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: optional_division,
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
          title: "最大得点",
          key: "piv",
          sortable: false,
        },
        {
          title: "グレイズ",
          key: "graze",
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map((stage) => {
        let lifeLabel;
        if (stage.lives !== null && stage.life_pieces !== null) {
          lifeLabel =
            String(stage.lives) + " + (" + String(stage.life_pieces) + "/3)";
        } else {
          lifeLabel = "-";
        }

        let bombLabel;
        if (stage.bombs !== null && stage.bomb_pieces !== null) {
          bombLabel =
            String(stage.bombs) + " + (" + String(stage.bomb_pieces) + "/3)";
        } else {
          bombLabel = "-";
        }

        return {
          stage: String(stage.stage) !== "7" ? stage.stage : "Ex",
          score:
            stage.score !== null ? Number(stage.score).toLocaleString() : "-",
          power:
            stage.power !== null ? (Number(stage.power) / 100).toFixed(2) : "-",
          lives: lifeLabel,
          bombs: bombLabel,
          piv: stage.piv !== null ? Number(stage.piv).toLocaleString() : "-",
          graze:
            stage.graze !== null ? Number(stage.graze).toLocaleString() : "-",
        };
      }),
    },
  };
}
