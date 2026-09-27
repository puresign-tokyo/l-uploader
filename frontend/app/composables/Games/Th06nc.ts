import { useTableUtils } from "./TableUtils";

const spellCardMap: Record<string, { ja: string; en: string }> = {
  0: { ja: "月符「ムーンライトレイ」", en: 'Moon Sign "Moonlight Ray"' },
  1: { ja: "月符「ムーンライトレイ」", en: 'Moon Sign "Moonlight Ray"' },
  2: { ja: "夜符「ナイトバード」", en: 'Night Sign "Night Bird"' },
  3: { ja: "夜符「ナイトバード」", en: 'Night Sign "Night Bird"' },
  4: { ja: "夜符「ナイトバード」", en: 'Night Sign "Night Bird"' },
  5: { ja: "闇符「ディマーケイション」", en: 'Darkness Sign "Demarcation"' },
  6: { ja: "闇符「ディマーケイション」", en: 'Darkness Sign "Demarcation"' },
  7: { ja: "闇符「ディマーケイション」", en: 'Darkness Sign "Demarcation"' },
  8: { ja: "闇符「ディマーケイション」", en: 'Darkness Sign "Demarcation"' },
  9: { ja: "氷符「アイシクルフォール」", en: 'Ice Sign "Icicle Fall"' },
  10: { ja: "氷符「アイシクルフォール」", en: 'Ice Sign "Icicle Fall"' },
  11: { ja: "雹符「ヘイルストーム」", en: 'Hail Sign "Hailstorm"' },
  12: { ja: "雹符「ヘイルストーム」", en: 'Hail Sign "Hailstorm"' },
  13: {
    ja: "凍符「パーフェクトフリーズ」",
    en: 'Freeze Sign "Perfect Freeze"',
  },
  14: {
    ja: "凍符「パーフェクトフリーズ」",
    en: 'Freeze Sign "Perfect Freeze"',
  },
  15: {
    ja: "凍符「パーフェクトフリーズ」",
    en: 'Freeze Sign "Perfect Freeze"',
  },
  16: {
    ja: "凍符「パーフェクトフリーズ」",
    en: 'Freeze Sign "Perfect Freeze"',
  },
  17: {
    ja: "雪符「ダイアモンドブリザード」",
    en: 'Snow Sign "Diamond Blizzard"',
  },
  18: {
    ja: "雪符「ダイアモンドブリザード」",
    en: 'Snow Sign "Diamond Blizzard"',
  },
  19: {
    ja: "雪符「ダイアモンドブリザード」",
    en: 'Snow Sign "Diamond Blizzard"',
  },
  20: { ja: "華符「芳華絢爛」", en: 'Flower Sign "Gorgeous Sweet Flower"' },
  21: { ja: "華符「芳華絢爛」", en: 'Flower Sign "Gorgeous Sweet Flower"' },
  22: { ja: "華符「セラギネラ９」", en: 'Flower Sign "Selaginella 9"' },
  23: { ja: "華符「セラギネラ９」", en: 'Flower Sign "Selaginella 9"' },
  24: {
    ja: "虹符「彩虹の風鈴」",
    en: 'Rainbow Sign "Colorful Rainbow Wind Chime"',
  },
  25: {
    ja: "虹符「彩虹の風鈴」",
    en: 'Rainbow Sign "Colorful Rainbow Wind Chime"',
  },
  26: {
    ja: "虹符「彩虹の風鈴」",
    en: 'Rainbow Sign "Colorful Rainbow Wind Chime"',
  },
  27: {
    ja: "虹符「彩虹の風鈴」",
    en: 'Rainbow Sign "Colorful Rainbow Wind Chime"',
  },
  28: {
    ja: "幻符「華想夢葛」",
    en: 'Illusion Sign "Imaginary Flower Yumekazura"',
  },
  29: {
    ja: "幻符「華想夢葛」",
    en: 'Illusion Sign "Imaginary Flower Yumekazura"',
  },
  30: { ja: "彩符「彩雨」", en: 'Colorful Sign "Colorful Rain"' },
  31: { ja: "彩符「彩雨」", en: 'Colorful Sign "Colorful Rain"' },
  32: { ja: "彩符「彩光乱舞」", en: 'Colorful Sign "Vivid Chaotic Dance"' },
  33: { ja: "彩符「彩光乱舞」", en: 'Colorful Sign "Vivid Chaotic Dance"' },
  34: { ja: "彩符「極彩颱風」", en: 'Colorful Sign "Dazzling Color Typhoon"' },
  35: { ja: "彩符「極彩颱風」", en: 'Colorful Sign "Dazzling Color Typhoon"' },
  36: { ja: "彩符「極彩颱風」", en: 'Colorful Sign "Dazzling Color Typhoon"' },
  37: { ja: "火符「アグニシャイン」", en: 'Fire Sign "Agni Shine"' },
  38: { ja: "火符「アグニシャイン」", en: 'Fire Sign "Agni Shine"' },
  39: {
    ja: "火符「アグニシャイン上級」",
    en: 'Fire Sign "Greater Agni Shine"',
  },
  40: {
    ja: "火符「アグニシャイン上級」",
    en: 'Fire Sign "Greater Agni Shine"',
  },
  41: {
    ja: "火符「アグニシャイン上級」",
    en: 'Fire Sign "Greater Agni Shine"',
  },
  42: { ja: "火符「アグニレイディアンス」", en: 'Fire Sign "Agni Radiance"' },
  43: { ja: "火符「アグニレイディアンス」", en: 'Fire Sign "Agni Radiance"' },
  44: {
    ja: "水符「プリンセスウンディネ」",
    en: 'Water Sign "Princess Undine"',
  },
  45: {
    ja: "水符「プリンセスウンディネ」",
    en: 'Water Sign "Princess Undine"',
  },
  46: { ja: "水符「ベリーインレイク」", en: 'Water Sign "Bury In Lake"' },
  47: { ja: "水符「ベリーインレイク」", en: 'Water Sign "Bury In Lake"' },
  48: { ja: "木符「シルフィホルン」", en: 'Wood Sign "Sylphy Horn"' },
  49: { ja: "木符「シルフィホルン」", en: 'Wood Sign "Sylphy Horn"' },
  50: {
    ja: "木符「シルフィホルン上級」",
    en: 'Wood Sign "Greater Sylphy Horn"',
  },
  51: {
    ja: "木符「シルフィホルン上級」",
    en: 'Wood Sign "Greater Sylphy Horn"',
  },
  52: {
    ja: "木符「シルフィホルン上級」",
    en: 'Wood Sign "Greater Sylphy Horn"',
  },
  53: { ja: "木符「グリーンストーム」", en: 'Wood Sign "Green Storm"' },
  54: { ja: "木符「グリーンストーム」", en: 'Wood Sign "Green Storm"' },
  55: { ja: "土符「レイジィトリリトン」", en: 'Earth Sign "Lazy Trilithon"' },
  56: { ja: "土符「レイジィトリリトン」", en: 'Earth Sign "Lazy Trilithon"' },
  57: {
    ja: "土符「レイジィトリリトン上級」",
    en: 'Earth Sign "Greater Lazy Trilithon"',
  },
  58: {
    ja: "土符「レイジィトリリトン上級」",
    en: 'Earth Sign "Greater Lazy Trilithon"',
  },
  59: {
    ja: "土符「レイジィトリリトン上級」",
    en: 'Earth Sign "Greater Lazy Trilithon"',
  },
  60: { ja: "土符「トリリトンシェイク」", en: 'Earth Sign "Trilithon Shake"' },
  61: { ja: "土符「トリリトンシェイク」", en: 'Earth Sign "Trilithon Shake"' },
  62: { ja: "金符「メタルファティーグ」", en: 'Metal Sign "Metal Fatigue"' },
  63: { ja: "金符「シルバードラゴン」", en: 'Metal Sign "Silver Dragon"' },
  64: { ja: "金符「シルバードラゴン」", en: 'Metal Sign "Silver Dragon"' },
  65: {
    ja: "火＆土符「ラーヴァクロムレク」",
    en: 'Fire & Earth Sign "Lava Cromlech"',
  },
  66: {
    ja: "火＆土符「ラーヴァクロムレク」",
    en: 'Fire & Earth Sign "Lava Cromlech"',
  },
  67: {
    ja: "火＆土符「ラーヴァクロムレク」",
    en: 'Fire & Earth Sign "Lava Cromlech"',
  },
  68: {
    ja: "火＆土符「ラーヴァクロムレク」",
    en: 'Fire & Earth Sign "Lava Cromlech"',
  },
  69: {
    ja: "木＆火符「フォレストブレイズ」",
    en: 'Wood & Fire Sign "Forest Blaze"',
  },
  70: {
    ja: "木＆火符「フォレストブレイズ」",
    en: 'Wood & Fire Sign "Forest Blaze"',
  },
  71: {
    ja: "木＆火符「フォレストブレイズ」",
    en: 'Wood & Fire Sign "Forest Blaze"',
  },
  72: {
    ja: "木＆火符「フォレストブレイズ」",
    en: 'Wood & Fire Sign "Forest Blaze"',
  },
  73: {
    ja: "水＆木符「ウォーターエルフ」",
    en: 'Water & Wood Sign "Water Elf"',
  },
  74: {
    ja: "水＆木符「ウォーターエルフ」",
    en: 'Water & Wood Sign "Water Elf"',
  },
  75: {
    ja: "水＆木符「ウォーターエルフ」",
    en: 'Water & Wood Sign "Water Elf"',
  },
  76: {
    ja: "水＆木符「ウォーターエルフ」",
    en: 'Water & Wood Sign "Water Elf"',
  },
  77: {
    ja: "金＆水符「マーキュリポイズン」",
    en: 'Metal & Water Sign "Mercury Poison"',
  },
  78: {
    ja: "金＆水符「マーキュリポイズン」",
    en: 'Metal & Water Sign "Mercury Poison"',
  },
  79: {
    ja: "金＆水符「マーキュリポイズン」",
    en: 'Metal & Water Sign "Mercury Poison"',
  },
  80: {
    ja: "土＆金符「エメラルドメガリス」",
    en: 'Earth & Metal Sign "Emerald Megalith"',
  },
  81: {
    ja: "土＆金符「エメラルドメガリス」",
    en: 'Earth & Metal Sign "Emerald Megalith"',
  },
  82: {
    ja: "土＆金符「エメラルドメガリス」",
    en: 'Earth & Metal Sign "Emerald Megalith"',
  },
  83: {
    ja: "土＆金符「エメラルドメガリス」",
    en: 'Earth & Metal Sign "Emerald Megalith"',
  },
  84: { ja: "奇術「ミスディレクション」", en: 'Conjuring "Misdirection"' },
  85: { ja: "奇術「ミスディレクション」", en: 'Conjuring "Misdirection"' },
  86: {
    ja: "奇術「幻惑ミスディレクション」",
    en: 'Conjuring "Mesmerizing Misdirection"',
  },
  87: {
    ja: "奇術「幻惑ミスディレクション」",
    en: 'Conjuring "Mesmerizing Misdirection"',
  },
  88: {
    ja: "幻在「クロックコープス」",
    en: 'Illusionary Existence "Clock Corpse"',
  },
  89: {
    ja: "幻在「クロックコープス」",
    en: 'Illusionary Existence "Clock Corpse"',
  },
  90: {
    ja: "幻幽「ジャック・ザ・ルドビレ」",
    en: 'Illusionary Phantom "Jack the Ludo Bile"',
  },
  91: {
    ja: "幻幽「ジャック・ザ・ルドビレ」",
    en: 'Illusionary Phantom "Jack the Ludo Bile"',
  },
  92: { ja: "幻象「ルナクロック」", en: 'Illusionary Image "Luna Clock"' },
  93: { ja: "幻象「ルナクロック」", en: 'Illusionary Image "Luna Clock"' },
  94: { ja: "幻世「ザ・ワールド」", en: 'Illusion World "The World"' },
  95: { ja: "幻世「ザ・ワールド」", en: 'Illusion World "The World"' },
  96: {
    ja: "メイド秘技「操りドール」",
    en: 'Maid Secret Skill "Marionette Doll"',
  },
  97: {
    ja: "メイド秘技「操りドール」",
    en: 'Maid Secret Skill "Marionette Doll"',
  },
  98: {
    ja: "メイド秘技「殺人ドール」",
    en: 'Maid Secret Skill "Killing Doll"',
  },
  99: {
    ja: "メイド秘技「殺人ドール」",
    en: 'Maid Secret Skill "Killing Doll"',
  },
  100: { ja: "奇術「エターナルミーク」", en: 'Conjuring "Eternal Meek"' },
  101: { ja: "奇術「エターナルミーク」", en: 'Conjuring "Eternal Meek"' },
  102: { ja: "奇術「エターナルミーク」", en: 'Conjuring "Eternal Meek"' },
  103: {
    ja: "天罰「スターオブヴァニティーズ」",
    en: 'Heaven\'s Punishment "Star of Vanities"',
  },
  104: {
    ja: "神罰「幼きデーモンロード」",
    en: 'Divine Punishment "Young Demon Lord"',
  },
  105: {
    ja: "神罰「幼きデーモンロード」",
    en: 'Divine Punishment "Young Demon Lord"',
  },
  106: { ja: "冥符「紅色の冥界」", en: 'Nether Sign "Scarlet Netherworld"' },
  107: {
    ja: "獄符「千本の針の山」",
    en: 'Hell Sign "Mountain of a Thousand Needles"',
  },
  108: {
    ja: "獄符「千本の針の山」",
    en: 'Hell Sign "Mountain of a Thousand Needles"',
  },
  109: {
    ja: "呪詛「ブラド・ツェペシュの呪い」",
    en: 'Curse "Curse of Vlad Tepes"',
  },
  110: { ja: "神術「吸血鬼幻想」", en: 'Dinine Art "Vampiric Illusion"' },
  111: { ja: "神術「吸血鬼幻想」", en: 'Dinine Art "Vampiric Illusion"' },
  112: {
    ja: "紅符「スカーレットシュート」",
    en: 'Scarlet Sign "Scarlet Shoot"',
  },
  113: {
    ja: "紅符「スカーレットマイスタ」",
    en: 'Scarlet Sign "Scarlet Meister"',
  },
  114: {
    ja: "紅符「スカーレットマイスタ」",
    en: 'Scarlet Sign "Scarlet Meister"',
  },
  115: { ja: "「レッドマジック」", en: '"Red Magic"' },
  116: { ja: "「紅色の幻想郷」", en: '"Scarlet Gensoukyou"' },
  117: { ja: "「紅色の幻想郷」", en: '"Scarlet Gensoukyou"' },
  118: { ja: "月符「サイレントセレナ」", en: 'Moon Sign "Silent Selene"' },
  119: { ja: "日符「ロイヤルフレア」", en: 'Sun Sign "Royal Flare"' },
  120: {
    ja: "火水木金土符「賢者の石」",
    en: 'Fire Water Wood Metal Earth Sign "Philosopher\'s Stone"',
  },
  121: { ja: "禁忌「クランベリートラップ」", en: 'Taboo "Cranberry Trap"' },
  122: { ja: "禁忌「レーヴァテイン」", en: 'Taboo "Lävateinn"' },
  123: { ja: "禁忌「フォーオブアカインド」", en: 'Taboo "Four of a Kind"' },
  124: { ja: "禁忌「カゴメカゴメ」", en: 'Taboo "Kagome, Kagome"' },
  125: { ja: "禁忌「恋の迷路」", en: 'Taboo "Maze of Love"' },
  126: {
    ja: "禁弾「スターボウブレイク」",
    en: 'Forbidden Barrage "Starbow Break"',
  },
  127: {
    ja: "禁弾「カタディオプトリック」",
    en: 'Forbidden Barrage "Catadioptric"',
  },
  128: {
    ja: "禁弾「過去を刻む時計」",
    en: 'Forbidden Barrage "Clock that Ticks Away the Past"',
  },
  129: {
    ja: "秘弾「そして誰もいなくなるか？」",
    en: 'Secret Barrage "And Then Will There Be None?"',
  },
  130: { ja: "ＱＥＤ「４９５年の波紋」", en: 'Q.E.D. "Ripples of 495 Years"' },
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
