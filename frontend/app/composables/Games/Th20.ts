import { useTableUtils } from "./TableUtils";
const spellCardMap: Record<string, { ja: string; en: string }> = {
  0: {
    ja: "塵符「コズミックダスト」",
    en: 'Dust Sign "Cosmic Dust"',
  },
  1: {
    ja: "塵符「コズミックダスト」",
    en: 'Dust Sign "Cosmic Dust"',
  },
  2: {
    ja: "塵符「宇宙塵」",
    en: 'Dust Sign "Space Dust"',
  },
  3: {
    ja: "塵符「宇宙塵」",
    en: 'Dust Sign "Space Dust"',
  },
  4: {
    ja: "塵符「唐櫃返し」",
    en: 'Dust Sign "Karabitsu Upheaval"',
  },
  5: {
    ja: "塵符「唐櫃返し」",
    en: 'Dust Sign "Karabitsu Upheaval"',
  },
  6: {
    ja: "塵符「唐櫃大返し」",
    en: 'Dust Sign "Great Karabitsu Upheaval"',
  },
  7: {
    ja: "塵符「唐櫃大返し」",
    en: 'Dust Sign "Great Karabitsu Upheaval"',
  },
  8: {
    ja: "塵符「塵のすみか」",
    en: 'Dust Sign "Dwelling of Dust"',
  },
  9: {
    ja: "塵符「塵のすみか」",
    en: 'Dust Sign "Dwelling of Dust"',
  },
  10: {
    ja: "塵符「塵のすみか」",
    en: 'Dust Sign "Dwelling of Dust"',
  },
  11: {
    ja: "塵符「塵のすみか」",
    en: 'Dust Sign "Dwelling of Dust"',
  },
  12: {
    ja: "魅符「まつろわぬ沢の気」",
    en: 'Bewitching Sign "Qi of an Unruly Swamp"',
  },
  13: {
    ja: "魅符「まつろわぬ沢の気」",
    en: 'Bewitching Sign "Qi of an Unruly Swamp"',
  },
  14: {
    ja: "魅符「荒くれる沢の気」",
    en: 'Bewitching Sign "Qi of an Abusive Swamp"',
  },
  15: {
    ja: "魅符「荒くれる沢の気」",
    en: 'Bewitching Sign "Qi of an Abusive Swamp"',
  },
  16: {
    ja: "魅符「うなされる森の気」",
    en: 'Bewitching Sign "Qi of a Restless Forest"',
  },
  17: {
    ja: "魅符「うなされる森の気」",
    en: 'Bewitching Sign "Qi of a Restless Forest"',
  },
  18: {
    ja: "魅符「息苦しい森の気」",
    en: 'Bewitching Sign "Qi of an Suffocating Forest"',
  },
  19: {
    ja: "魅符「息苦しい森の気」",
    en: 'Bewitching Sign "Qi of an Suffocating Forest"',
  },
  20: {
    ja: "魑符「荒ぶる山の気」",
    en: 'Mountain Spirit Sign "Qi of a Savage Mountain"',
  },
  21: {
    ja: "魑符「荒ぶる山の気」",
    en: 'Mountain Spirit Sign "Qi of a Savage Mountain"',
  },
  22: {
    ja: "魑符「怒れる山の気」",
    en: 'Mountain Spirit Sign "Qi of a Furious Mountain"',
  },
  23: {
    ja: "魑符「怒れる山の気」",
    en: 'Mountain Spirit Sign "Qi of a Furious Mountain"',
  },
  24: {
    ja: "謎符「ピラミダルラビリンス」",
    en: 'Riddle Sign "Pyramidal Labyrinth"',
  },
  25: {
    ja: "謎符「ピラミダルラビリンス」",
    en: 'Riddle Sign "Pyramidal Labyrinth"',
  },
  26: {
    ja: "謎符「ヘキサゴナルラビリンス」",
    en: 'Riddle Sign "Hexagonal Labyrinth"',
  },
  27: {
    ja: "謎符「ヘキサゴナルラビリンス」",
    en: 'Riddle Sign "Hexagonal Labyrinth"',
  },
  28: {
    ja: "塞符「ロジカルウォール」",
    en: 'Obstructing Sign "Logical Wall"',
  },
  29: {
    ja: "塞符「ロジカルウォール」",
    en: 'Obstructing Sign "Logical Wall"',
  },
  30: {
    ja: "塞符「ロジカルグレートウォール」",
    en: 'Obstructing Sign "Logical Great Wall"',
  },
  31: {
    ja: "塞符「ロジカルグレートウォール」",
    en: 'Obstructing Sign "Logical Great Wall"',
  },
  32: {
    ja: "謎符「エンシャントトラップ」",
    en: 'Riddle Sign "Ancient Trap"',
  },
  33: {
    ja: "謎符「エンシャントトラップ」",
    en: 'Riddle Sign "Ancient Trap"',
  },
  34: {
    ja: "謎符「エンシャントトラップ」",
    en: 'Riddle Sign "Ancient Trap"',
  },
  35: {
    ja: "謎符「エンシャントトラップ」",
    en: 'Riddle Sign "Ancient Trap"',
  },
  36: {
    ja: "金符「弾幕の金字塔」",
    en: 'Gold Sign "Danmaku Pyramid"',
  },
  37: {
    ja: "金符「弾幕の金字塔」",
    en: 'Gold Sign "Danmaku Pyramid"',
  },
  38: {
    ja: "金符「弾幕の金字塔」",
    en: 'Gold Sign "Danmaku Pyramid"',
  },
  39: {
    ja: "金符「弾幕の金字塔」",
    en: 'Gold Sign "Danmaku Pyramid"',
  },
  40: {
    ja: "虚符「ストリーミングドール」",
    en: 'Void Sign "Streaming Doll"',
  },
  41: {
    ja: "虚符「ストリーミングドール」",
    en: 'Void Sign "Streaming Doll"',
  },
  42: {
    ja: "虚符「ストリーミングマリオネット」",
    en: 'Void Sign "Streaming Marionette"',
  },
  43: {
    ja: "虚符「ストリーミングマリオネット」",
    en: 'Void Sign "Streaming Marionette"',
  },
  44: {
    ja: "群符「ラブルデータ」",
    en: 'Crowd Sign "Rabble Data"',
  },
  45: {
    ja: "群符「ラブルデータ」",
    en: 'Crowd Sign "Rabble Data"',
  },
  46: {
    ja: "群符「ラブルビッグデータ」",
    en: 'Crowd Sign "Rabble Big Data"',
  },
  47: {
    ja: "群符「ラブルビッグデータ」",
    en: 'Crowd Sign "Rabble Big Data"',
  },
  48: {
    ja: "「シカを射るだけの美しい記憶」",
    en: '"Beautiful Memories of Just Hunting Deer"',
  },
  49: {
    ja: "「シカを射るだけの美しい記憶」",
    en: '"Beautiful Memories of Just Hunting Deer"',
  },
  50: {
    ja: "「シカを射るだけの美しい記憶」",
    en: '"Beautiful Memories of Just Hunting Deer"',
  },
  51: {
    ja: "「シカを射るだけの美しい記憶」",
    en: '"Beautiful Memories of Just Hunting Deer"',
  },
  52: {
    ja: "虚構「ディスコミュニケーション」",
    en: 'Fiction "Discommunication"',
  },
  53: {
    ja: "虚構「ディスコミュニケーション」",
    en: 'Fiction "Discommunication"',
  },
  54: {
    ja: "虚構「ディスコミュニケーション」",
    en: 'Fiction "Discommunication"',
  },
  55: {
    ja: "虚構「ディスコミュニケーション」",
    en: 'Fiction "Discommunication"',
  },
  56: {
    ja: "宝珠「潮盈珠」",
    en: 'Precious Gem "Tide-Flowing Jewel"',
  },
  57: {
    ja: "宝珠「潮盈珠」",
    en: 'Precious Gem "Tide-Flowing Jewel"',
  },
  58: {
    ja: "宝珠「潮盈珠」",
    en: 'Precious Gem "Tide-Flowing Jewel"',
  },
  59: {
    ja: "宝珠「潮盈珠」",
    en: 'Precious Gem "Tide-Flowing Jewel"',
  },
  60: {
    ja: "災禍「山津波」",
    en: 'Disaster "Landslide"',
  },
  61: {
    ja: "災禍「山津波」",
    en: 'Disaster "Landslide"',
  },
  62: {
    ja: "災禍「長い山津波」",
    en: 'Disaster "Lengthy Landslide"',
  },
  63: {
    ja: "災禍「終わらない山津波」",
    en: 'Disaster "Never-ending Landslide"',
  },
  64: {
    ja: "宝珠「潮乾珠」",
    en: 'Precious Gem "Tide-Ebbing Jewel"',
  },
  65: {
    ja: "宝珠「潮乾珠」",
    en: 'Precious Gem "Tide-Ebbing Jewel"',
  },
  66: {
    ja: "宝珠「潮乾珠」",
    en: 'Precious Gem "Tide-Ebbing Jewel"',
  },
  67: {
    ja: "宝珠「潮乾珠」",
    en: 'Precious Gem "Tide-Ebbing Jewel"',
  },
  68: {
    ja: "「ムーンドラゴン」",
    en: '"Moon Dragon"',
  },
  69: {
    ja: "「ムーンドラゴン」",
    en: '"Moon Dragon"',
  },
  70: {
    ja: "「ムーンドラゴン」",
    en: '"Moon Dragon"',
  },
  71: {
    ja: "「ムーンドラゴン」",
    en: '"Moon Dragon"',
  },
  72: {
    ja: "石神「巌となるさざれ石」",
    en: 'Stone God "Small Pebbles Forming a Boulder"',
  },
  73: {
    ja: "石神「巌となるさざれ石」",
    en: 'Stone God "Small Pebbles Forming a Boulder"',
  },
  74: {
    ja: "石神「巌となるさざれ石」",
    en: 'Stone God "Small Pebbles Forming a Boulder"',
  },
  75: {
    ja: "石神「巌となるさざれ石」",
    en: 'Stone God "Small Pebbles Forming a Boulder"',
  },
  76: {
    ja: "死符「永遠の冬」",
    en: 'Death Sign "Eternal Winter"',
  },
  77: {
    ja: "死符「永遠の冬」",
    en: 'Death Sign "Eternal Winter"',
  },
  78: {
    ja: "死符「恒久の冬」",
    en: 'Death Sign "Permanent Winter"',
  },
  79: {
    ja: "死符「恒久の冬」",
    en: 'Death Sign "Permanent Winter"',
  },
  80: {
    ja: "生符「混沌の冬」",
    en: 'Life Sign "Chaotic Winter"',
  },
  81: {
    ja: "生符「混沌の冬」",
    en: 'Life Sign "Chaotic Winter"',
  },
  82: {
    ja: "生符「混沌の冬」",
    en: 'Life Sign "Chaotic Winter"',
  },
  83: {
    ja: "生符「混沌の冬」",
    en: 'Life Sign "Chaotic Winter"',
  },
  84: {
    ja: "「弾幕の化石」",
    en: '"Danmaku Fossil"',
  },
  85: {
    ja: "「弾幕の化石」",
    en: '"Danmaku Fossil"',
  },
  86: {
    ja: "「弾幕の化石」",
    en: '"Danmaku Fossil"',
  },
  87: {
    ja: "「弾幕の化石」",
    en: '"Danmaku Fossil"',
  },
  88: {
    ja: "地符「幻想のリリクウィ」",
    en: 'Land Sign "illusionary Reliquae"',
  },
  89: {
    ja: "地符「幻想のリリクウィ」",
    en: 'Land Sign "illusionary Reliquae"',
  },
  90: {
    ja: "地符「幻想のリリクウィ」",
    en: 'Land Sign "illusionary Reliquae"',
  },
  91: {
    ja: "地符「幻想のリリクウィ」",
    en: 'Land Sign "illusionary Reliquae"',
  },
  92: {
    ja: "月符「錦の上のイマジナリー」",
    en: 'Moon Sign "Imaginary Atop the Brocade"',
  },
  93: {
    ja: "月符「錦の上のイマジナリー」",
    en: 'Moon Sign "Imaginary Atop the Brocade"',
  },
  94: {
    ja: "月符「錦の上のイマジナリー」",
    en: 'Moon Sign "Imaginary Atop the Brocade"',
  },
  95: {
    ja: "月符「錦の上のイマジナリー」",
    en: 'Moon Sign "Imaginary Atop the Brocade"',
  },
  96: {
    ja: "「ストーンゴッデス」",
    en: '"Stone Goddess"',
  },
  97: {
    ja: "「ストーンゴッデス」",
    en: '"Stone Goddess"',
  },
  98: {
    ja: "「不生不滅の石の女神」",
    en: '"Goddess of Unliving, Undying Stone"',
  },
  99: {
    ja: "「不生不滅の石の女神」",
    en: '"Goddess of Unliving, Undying Stone"',
  },
  100: {
    ja: "鹿符「ディアジェノサイダー」",
    en: 'Deer Sign "Deer Genocider"',
  },
  101: {
    ja: "蛇姫「スネークランダー」",
    en: 'Snake Princess "Snakelander"',
  },
  102: {
    ja: "「ゾルタクスコミュニケーション」",
    en: '"Zoltax Communication"',
  },
  103: {
    ja: "真実「テトラモノアイ」",
    en: 'Truth "Tetra Mono-Eye"',
  },
  104: {
    ja: "真実「オールドイルミナティ」",
    en: 'Truth "Old Illuminati"',
  },
  105: {
    ja: "真実「ケムトレイルクラウド」",
    en: 'Truth "Chemtrail Cloud"',
  },
  106: {
    ja: "真実「レプティリアニンテリジェンス」",
    en: 'Truth "Reptilian Intelligence"',
  },
  107: {
    ja: "真実「フラットアーサー」",
    en: 'Truth "Flat Earther"',
  },
  108: {
    ja: "真実「アーティフィシャルディサスター」",
    en: 'Truth "Artificial Disaster"',
  },
  109: {
    ja: "真実「ニューワールドオーダー」",
    en: 'Truth "New World Order"',
  },
  110: {
    ja: "真実「タルタリアンラプソディ」",
    en: 'Truth "Tartarian Rhapsody"',
  },
  111: {
    ja: "「チョコレートリバー」",
    en: '"Chocolate River"',
  },
  112: {
    ja: "「アンゴルモアの大王」",
    en: '"Great King of Angolmois"',
  },
};

function convertSpellCard(spell_card_id: string) {
  return spellCardMap[spell_card_id] ?? { ja: "不明", en: "Unknown" };
}

const equipmentMap: Record<string, { label: string }> = {
  Red: { label: "赤1" },
  Red2: { label: "赤2" },
  Blue: { label: "青1" },
  Blue2: { label: "青2" },
  Yellow: { label: "黄1" },
  Yellow2: { label: "黄2" },
  Green: { label: "緑1" },
  Green2: { label: "緑2" },
  Common: { label: "コモン" },
};

function convertShotType(shot_type_id: string) {
  let character;
  let character_id;
  let main_equipment_id;
  let main_equipment;
  if (shot_type_id.startsWith("Reimu")) {
    character_id = "Reimu";
    character = useTableUtils().convertCharacter(character_id);
    main_equipment_id = shot_type_id.slice(5);
    main_equipment = equipmentMap[main_equipment_id];
  } else if (shot_type_id.startsWith("Marisa")) {
    character_id = "Marisa";
    character = useTableUtils().convertCharacter(character_id);
    main_equipment_id = shot_type_id.slice(6);
    main_equipment = equipmentMap[main_equipment_id];
  } else {
    return { label: "Unknown", color: "white" };
  }

  if (main_equipment === undefined || character === undefined) {
    return { label: "Unknown", color: "white" };
  } else {
    return {
      label: character.label + "-" + main_equipment.label,
      color: character.color,
    };
  }
}

interface Th20Replay {
  replay_id: string;
  game_id: string;
  user_name: string;
  uploaded_at: string;
  upload_comment: string;
  category: string;
  optional_tag: string;
  filename: string;
  parser_version: string;
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

export function Th20Table(replay: Th20Replay) {
  let optional_division = null;
  if (replay.replay_meta.replay_type === "spell_card") {
    optional_division = {
      label: convertSpellCard(replay.replay_meta.spell_card_id).ja,
      color: "light-blue-darken-3",
    };
  }

  return {
    game_meta: {
      theme_color: "#BCEDF0",
      img: {
        thumb: "/images/thumb/th20.png",
        full: "/images/full/th20.png",
        alt: "th20",
      },
      name: "東方錦上京 〜 Fossilized Wonders.",
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
      headers: [],
      items: [],
    },
  };
}
