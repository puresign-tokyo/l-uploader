import { useTableUtils } from "./TableUtils";
const enemyMap: Record<string, { ja: string; en: string }> = {
  Sizuha: {
    ja: "秋 静葉",
    en: "Shizuha Aki",
  },
  Minoriko: {
    ja: "秋 穣子",
    en: "Minoriko Aki",
  },
  Parsee: {
    ja: "水橋 パルスィ",
    en: "Parsee Mizuhashi",
  },
  Hina: {
    ja: "鍵山 雛",
    en: "Hina Kagiyama",
  },
  Kogasa: {
    ja: "多々良 小傘",
    en: "Kogasa Tatara",
  },
  Kisume: {
    ja: "キスメ",
    en: "Kisume",
  },
  Yamame: {
    ja: "黒谷 ヤマメ",
    en: "Yamame Kurotani",
  },
  Nitori: {
    ja: "河城 にとり",
    en: "Nitori Kawashiro",
  },
  Momiji: {
    ja: "犬走 椛",
    en: "Momiji Inubashiri",
  },
  Ichirin: {
    ja: "雲居 一輪＆雲山",
    en: "Ichirin Kumoi & Unzan",
  },
  Minamitsu: {
    ja: "村紗 水蜜",
    en: "Minamitsu Murasa",
  },
  Yuugi: {
    ja: "星熊 勇儀",
    en: "Yuugi Hoshiguma",
  },
  Suika: {
    ja: "伊吹 萃香",
    en: "Suika Ibuki",
  },
  Shou: {
    ja: "寅丸 星",
    en: "Syou Toramaru",
  },
  Nazrin: {
    ja: "ナズーリン",
    en: "Nazrin",
  },
  Utsuho: {
    ja: "霊烏路 空",
    en: "Utsuho Reiuji",
  },
  Rin: {
    ja: "火焔猫 燐",
    en: "Rin Kaenbyou",
  },
  Koishi: {
    ja: "古明地 こいし",
    en: "Koishi Komeiji",
  },
  Satori: {
    ja: "古明地 さとり",
    en: "Satori Komeiji",
  },
  Tenshi: {
    ja: "比那名居 天子",
    en: "Tenshi Hinanai",
  },
  Iku: {
    ja: "永江 衣玖",
    en: "Iku Nagae",
  },
  Suwako: {
    ja: "洩矢 諏訪子",
    en: "Suwako Moriya",
  },
  Kanako: {
    ja: "八坂 神奈子",
    en: "Kanako Yasaka",
  },
  Nue: {
    ja: "封獣 ぬえ",
    en: "Nue Houjuu",
  },
  Byakuren: {
    ja: "聖 白蓮",
    en: "Byakuren Hijiri",
  },
  Reimu: {
    ja: "博麗 霊夢",
    en: "Reimu Hakurei",
  },
  Marisa: {
    ja: "霧雨 魔理沙",
    en: "Marisa Kirisame",
  },
  Sanae: {
    ja: "東風谷 早苗",
    en: "Sanae Kochiya",
  },
  Hatate: {
    ja: "姫海棠 はたて",
    en: "Hatate Himekaidou",
  },
  Aya: {
    ja: "射命丸 文",
    en: "Aya Shameimaru",
  },
};

function convertEnemy(enemy_id: string) {
  return enemyMap[enemy_id] || { ja: "Unknown", en: "white" };
}

type Spell = {
  spellCard: { ja: string };
  boss: { ja: string; en: string };
};

const spellCardMap: Record<string, Record<string, Spell>> = {
  1: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Minoriko"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Minoriko"),
    },
    3: {
      spellCard: {
        ja: "秋符「フォーリンブラスト」",
      },
      boss: convertEnemy("Shizuha"),
    },
    4: {
      spellCard: {
        ja: "実符「ウォームカラーハーヴェスト」",
      },
      boss: convertEnemy("Minoriko"),
    },
    5: {
      spellCard: {
        ja: "枯道「ロストウィンドロウ」",
      },
      boss: convertEnemy("Shizuha"),
    },
    6: {
      spellCard: {
        ja: "焼芋「スイートポテトルーム」",
      },
      boss: convertEnemy("Minoriko"),
    },
  },
  2: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Parsee"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Hina"),
    },
    3: {
      spellCard: {
        ja: "嫉妬「ジェラシーボンバー」",
      },
      boss: convertEnemy("Parsee"),
    },
    4: {
      spellCard: {
        ja: "厄野「禊川の堆積」",
      },
      boss: convertEnemy("Hina"),
    },
    5: {
      spellCard: {
        ja: "怨み念法「積怨返し」",
      },
      boss: convertEnemy("Parsee"),
    },
    6: {
      spellCard: {
        ja: "災禍「呪いの雛人形」",
      },
      boss: convertEnemy("Hina"),
    },
  },
  3: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Yamame"),
    },
    2: {
      spellCard: {
        ja: "傘符「一本足ピッチャー返し」",
      },
      boss: convertEnemy("Kogasa"),
    },
    3: {
      spellCard: {
        ja: "釣瓶「飛んで井の中」",
      },
      boss: convertEnemy("Kisume"),
    },
    4: {
      spellCard: {
        ja: "細綱「カンダタロープ」",
      },
      boss: convertEnemy("Yamame"),
    },
    5: {
      spellCard: {
        ja: "虹符「オーバー・ザ・レインボー」",
      },
      boss: convertEnemy("Kogasa"),
    },
    6: {
      spellCard: {
        ja: "釣瓶「ウェルディストラクター」",
      },
      boss: convertEnemy("Kisume"),
    },
    7: {
      spellCard: {
        ja: "毒符「樺黄小町」",
      },
      boss: convertEnemy("Yamame"),
    },
  },
  4: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Nitori"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Momiji"),
    },
    3: {
      spellCard: {
        ja: "水符「ウォーターカーペット」",
      },
      boss: convertEnemy("Nitori"),
    },
    4: {
      spellCard: {
        ja: "狗符「レイビーズバイト」",
      },
      boss: convertEnemy("Momiji"),
    },
    5: {
      spellCard: {
        ja: "河符「ディバイディングエッジ」",
      },
      boss: convertEnemy("Nitori"),
    },
    6: {
      spellCard: {
        ja: "山窩「エクスペリーズカナン」",
      },
      boss: convertEnemy("Momiji"),
    },
    7: {
      spellCard: {
        ja: "河童「乾燥尻子玉」",
      },
      boss: convertEnemy("Nitori"),
    },
  },
  5: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Ichirin"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Minamitsu"),
    },
    3: {
      spellCard: {
        ja: "拳骨「天空鉄槌落とし」",
      },
      boss: convertEnemy("Ichirin"),
    },
    4: {
      spellCard: {
        ja: "錨符「幽霊船長期停泊」",
      },
      boss: convertEnemy("Minamitsu"),
    },
    5: {
      spellCard: {
        ja: "稲妻「帯電入道」",
      },
      boss: convertEnemy("Ichirin"),
    },
    6: {
      spellCard: {
        ja: "浸水「船底のヴィーナス」",
      },
      boss: convertEnemy("Minamitsu"),
    },
    7: {
      spellCard: {
        ja: "鉄拳「入道にょき」",
      },
      boss: convertEnemy("Ichirin"),
    },
    8: {
      spellCard: {
        ja: "「ディープシンカー」",
      },
      boss: convertEnemy("Ichirin"),
    },
  },
  6: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Yuugi"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Suika"),
    },
    3: {
      spellCard: {
        ja: "光鬼「金剛螺旋」",
      },
      boss: convertEnemy("Yuugi"),
    },
    4: {
      spellCard: {
        ja: "鬼符「豆粒大の針地獄」",
      },
      boss: convertEnemy("Suika"),
    },
    5: {
      spellCard: {
        ja: "鬼符「鬼気狂瀾」",
      },
      boss: convertEnemy("Yuugi"),
    },
    6: {
      spellCard: {
        ja: "地獄「煉獄吐息」",
      },
      boss: convertEnemy("Suika"),
    },
    7: {
      spellCard: {
        ja: "鬼声「壊滅の咆哮」",
      },
      boss: convertEnemy("Yuugi"),
    },
    8: {
      spellCard: {
        ja: "鬼符「ミッシングパワー」",
      },
      boss: convertEnemy("Suika"),
    },
  },
  7: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Shou"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Nazrin"),
    },
    3: {
      spellCard: {
        ja: "寅符「ハングリータイガー」",
      },
      boss: convertEnemy("Shou"),
    },
    4: {
      spellCard: {
        ja: "棒符「ナズーリンロッド」",
      },
      boss: convertEnemy("Nazrin"),
    },
    5: {
      spellCard: {
        ja: "天符「焦土曼荼羅」",
      },
      boss: convertEnemy("Shou"),
    },
    6: {
      spellCard: {
        ja: "財宝「ゴールドラッシュ」",
      },
      boss: convertEnemy("Nazrin"),
    },
    7: {
      spellCard: {
        ja: "宝符「黄金の震眩」",
      },
      boss: convertEnemy("Shou"),
    },
  },
  8: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Rin"),
    },
    2: {
      spellCard: {
        ja: "熔解「メルティングホワイト」",
      },
      boss: convertEnemy("Utsuho"),
    },
    3: {
      spellCard: {
        ja: "死符「ゴーストタウン」",
      },
      boss: convertEnemy("Rin"),
    },
    4: {
      spellCard: {
        ja: "巨星「レッドジャイアント」",
      },
      boss: convertEnemy("Utsuho"),
    },
    5: {
      spellCard: {
        ja: "「死体繁華街」",
      },
      boss: convertEnemy("Rin"),
    },
    6: {
      spellCard: {
        ja: "星符「巨星墜つ」",
      },
      boss: convertEnemy("Utsuho"),
    },
    7: {
      spellCard: {
        ja: "酔歩「キャットランダムウォーク」",
      },
      boss: convertEnemy("Rin"),
    },
    8: {
      spellCard: {
        ja: "七星「セプテントリオン」",
      },
      boss: convertEnemy("Utsuho"),
    },
  },
  9: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Satori"),
    },
    2: {
      spellCard: {
        ja: "心符「没我の愛」",
      },
      boss: convertEnemy("Koishi"),
    },
    3: {
      spellCard: {
        ja: "脳符「ブレインフィンガープリント」",
      },
      boss: convertEnemy("Satori"),
    },
    4: {
      spellCard: {
        ja: "記憶「ＤＮＡの瑕」",
      },
      boss: convertEnemy("Koishi"),
    },
    5: {
      spellCard: {
        ja: "心花「カメラシャイローズ」",
      },
      boss: convertEnemy("Satori"),
    },
    6: {
      spellCard: {
        ja: "「胎児の夢」",
      },
      boss: convertEnemy("Koishi"),
    },
    7: {
      spellCard: {
        ja: "想起「うろおぼえの金閣寺」",
      },
      boss: convertEnemy("Satori"),
    },
    8: {
      spellCard: {
        ja: "「ローズ地獄」",
      },
      boss: convertEnemy("Koishi"),
    },
  },
  10: {
    1: {
      spellCard: {
        ja: "気性「勇気凛々の剣」",
      },
      boss: convertEnemy("Tenshi"),
    },
    2: {
      spellCard: {
        ja: "雷符「ライトニングフィッシュ」",
      },
      boss: convertEnemy("Iku"),
    },
    3: {
      spellCard: {
        ja: "地震「避難険路」",
      },
      boss: convertEnemy("Tenshi"),
    },
    4: {
      spellCard: {
        ja: "珠符「五爪龍の珠」",
      },
      boss: convertEnemy("Iku"),
    },
    5: {
      spellCard: {
        ja: "要石「カナメファンネル」",
      },
      boss: convertEnemy("Tenshi"),
    },
    6: {
      spellCard: {
        ja: "龍宮「タイヤヒラメダンス」",
      },
      boss: convertEnemy("Iku"),
    },
    7: {
      spellCard: {
        ja: "「全人類の緋想天」",
      },
      boss: convertEnemy("Tenshi"),
    },
    8: {
      spellCard: {
        ja: "龍魚「龍宮の使い遊泳弾」",
      },
      boss: convertEnemy("Iku"),
    },
  },
  11: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Kanako"),
    },
    2: {
      spellCard: {
        ja: "神桜「湛えの桜吹雪」",
      },
      boss: convertEnemy("Suwako"),
    },
    3: {
      spellCard: {
        ja: "蛇符「グラウンドサーペント」",
      },
      boss: convertEnemy("Kanako"),
    },
    4: {
      spellCard: {
        ja: "姫川「プリンセスジェイドグリーン」",
      },
      boss: convertEnemy("Suwako"),
    },
    5: {
      spellCard: {
        ja: "御柱「メテオリックオンバシラ」",
      },
      boss: convertEnemy("Kanako"),
    },
    6: {
      spellCard: {
        ja: "鉄輪「ミシカルリング」",
      },
      boss: convertEnemy("Suwako"),
    },
    7: {
      spellCard: {
        ja: "儚道「御神渡りクロス」",
      },
      boss: convertEnemy("Kanako"),
    },
    8: {
      spellCard: {
        ja: "土着神「御射軍神さま」",
      },
      boss: convertEnemy("Suwako"),
    },
  },
  12: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Byakuren"),
    },
    2: {
      spellCard: {
        ja: "正体不明「紫鏡」",
      },
      boss: convertEnemy("Nue"),
    },
    3: {
      spellCard: {
        ja: "「遊行聖」",
      },
      boss: convertEnemy("Byakuren"),
    },
    4: {
      spellCard: {
        ja: "正体不明「赤マント青マント」",
      },
      boss: convertEnemy("Nue"),
    },
    5: {
      spellCard: {
        ja: "習合「垂迹大日如来」",
      },
      boss: convertEnemy("Byakuren"),
    },
    6: {
      spellCard: {
        ja: "正体不明「厠の花子さん」",
      },
      boss: convertEnemy("Nue"),
    },
    7: {
      spellCard: {
        ja: "「スターソードの護法」",
      },
      boss: convertEnemy("Byakuren"),
    },
    8: {
      spellCard: {
        ja: "「遊星よりの弾幕Ｘ」",
      },
      boss: convertEnemy("Nue"),
    },
  },
  EX: {
    1: {
      spellCard: {
        ja: "お札「新聞拡張団調伏」",
      },
      boss: convertEnemy("Reimu"),
    },
    2: {
      spellCard: {
        ja: "星符「オールトクラウド」",
      },
      boss: convertEnemy("Marisa"),
    },
    3: {
      spellCard: {
        ja: "奇跡「弘安の神風」",
      },
      boss: convertEnemy("Sanae"),
    },
    4: {
      spellCard: {
        ja: "結界「パパラッチ撃退結界」",
      },
      boss: convertEnemy("Reimu"),
    },
    5: {
      spellCard: {
        ja: "天儀「オーレリーズソーラーシステム」",
      },
      boss: convertEnemy("Marisa"),
    },
    6: {
      spellCard: {
        ja: "蛙符「手管の蝦蟇」",
      },
      boss: convertEnemy("Sanae"),
    },
    7: {
      spellCard: {
        ja: "夢符「夢想亜空穴」",
      },
      boss: convertEnemy("Reimu"),
    },
    8: {
      spellCard: {
        ja: "彗星「ブレイジングスター」",
      },
      boss: convertEnemy("Marisa"),
    },
    9: {
      spellCard: {
        ja: "妖怪退治「妖力スポイラー」",
      },
      boss: convertEnemy("Sanae"),
    },
  },
  SP: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Hatate"),
    },
    2: {
      spellCard: {
        ja: "取材「姫海棠はたての練習取材」",
      },
      boss: convertEnemy("Hatate"),
    },
    3: {
      spellCard: {
        ja: "連写「ラピッドショット」",
      },
      boss: convertEnemy("Hatate"),
    },
    4: {
      spellCard: {
        ja: "遠眼「天狗サイコグラフィ」",
      },
      boss: convertEnemy("Hatate"),
    },
    5: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Aya"),
    },
    6: {
      spellCard: {
        ja: "取材「射命丸文の圧迫取材」",
      },
      boss: convertEnemy("Aya"),
    },
    7: {
      spellCard: {
        ja: "望遠「キャンディッドショット」",
      },
      boss: convertEnemy("Aya"),
    },
    8: {
      spellCard: {
        ja: "速写「ファストショット」",
      },
      boss: convertEnemy("Aya"),
    },
    9: {
      spellCard: {
        ja: "「幻想風靡」",
      },
      boss: convertEnemy("Aya"),
    },
  },
};

function convertSpellCard(level: string, scene: string) {
  return (
    spellCardMap[level][scene] || {
      spellCard: { ja: "Unknown" },
      boss: { ja: "Unknown", en: "Unknwon" },
    }
  );
}

const shotTypeMap: Record<string, { label: string; color: string }> = {
  Aya: { label: "文", color: useTableUtils().convertCharacter("Aya").color },
  Hatate: { label: "はたて", color: "purple-darken-2" },
};

function convertShotType(shot_type_id: string) {
  return shotTypeMap[shot_type_id] || { label: "Unknown", color: "white" };
}

interface Th125Replay {
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
    level: string;
    scene: string;
    total_score: string;
    slowdown: string;
    timestamp: string;
    spell_card_id: string;
    stage_details: [];
  };
}

export function Th125Table(replay: Th125Replay) {
  let difficultyColor = "white";
  if (replay.replay_meta.level === "EX" || replay.replay_meta.level === "SP") {
    difficultyColor = useTableUtils().convertDifficulty("3").color;
  } else if (Number(replay.replay_meta.level) <= 3) {
    difficultyColor = useTableUtils().convertDifficulty("0").color;
  } else if (Number(replay.replay_meta.level) <= 6) {
    difficultyColor = useTableUtils().convertDifficulty("1").color;
  } else if (Number(replay.replay_meta.level) <= 9) {
    difficultyColor = useTableUtils().convertDifficulty("2").color;
  } else {
    difficultyColor = useTableUtils().convertDifficulty("3").color;
  }

  return {
    game_meta: {
      theme_color: "#7D3884",
      img: {
        thumb: "/images/thumb/th125.png",
        full: "/images/full/th125.png",
        alt: "th125",
      },
      name: "ダブルスポイラー 〜 東方文花帖",
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
    difficulty: {
      label:
        String(replay.replay_meta.level) +
        "-" +
        String(replay.replay_meta.scene),
      color: difficultyColor,
    },
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: {
      label: convertSpellCard(
        String(replay.replay_meta.level),
        String(replay.replay_meta.scene)
      ).spellCard.ja,
      color: "light-blue-darken-3",
    },
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: null,
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id,
    stage_details: {
      headers: [],
      items: [],
    },
  };
}
