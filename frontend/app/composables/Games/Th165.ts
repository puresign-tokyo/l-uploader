import { useTableUtils } from "./TableUtils";

const enemyMap: Record<string, { ja: string; en: string }> = {
  Seiran: {
    ja: "清蘭",
    en: "Seiran",
  },
  Ringo: {
    ja: "鈴瑚",
    en: "Ringo",
  },
  Larva: {
    ja: "エタニティ ラルバ",
    en: "Eternity Larva",
  },
  Narumi: {
    ja: "矢田寺 成美",
    en: "Narumi Yatadera",
  },
  Nemuno: {
    ja: "坂田 ネムノ",
    en: "Nemuno Sakata",
  },
  Aunn: {
    ja: "高麗野 あうん",
    en: "Aunn Komano",
  },
  Clownpiece: {
    ja: "クラウンピース",
    en: "Clownpiece",
  },
  Sagume: {
    ja: "稀神 サグメ",
    en: "Sagume Kishin",
  },
  Mai: {
    ja: "丁礼田 舞",
    en: "Mai Teireida",
  },
  Satono: {
    ja: "爾子田 里乃",
    en: "Satono Nishida",
  },
  Hecatia: {
    ja: "ヘカーティア・ラピスラズリ",
    en: "Hecatia Lapislazuli",
  },
  Junko: {
    ja: "純狐",
    en: "Junko",
  },
  Okina: {
    ja: "摩多羅 隠岐奈",
    en: "Okina Matara",
  },
  Remilia: {
    ja: "レミリア・スカーレット",
    en: "Remilia Scarlet",
  },
  Flandre: {
    ja: "フランドール・スカーレット",
    en: "Flandre Scarlet",
  },
  Byakuren: {
    ja: "聖 白蓮",
    en: "Byakuren Hijiri",
  },
  Miko: {
    ja: "豊聡耳 神子",
    en: "Toyosatomimi no Miko",
  },
  Yuyuko: {
    ja: "西行寺 幽々子",
    en: "Yuyuko Saigyouji",
  },
  Eiki: {
    ja: "四季映姫・ヤマザナドゥ",
    en: "Eiki Shiki, Yamaxanadu",
  },
  Kanako: {
    ja: "八坂 神奈子",
    en: "Kanako Yasaka",
  },
  Suwako: {
    ja: "洩矢 諏訪子",
    en: "Suwako Moriya",
  },
  Eirin: {
    ja: "八意 永琳",
    en: "Eirin Yagokoro",
  },
  Kaguya: {
    ja: "蓬莱山 輝夜",
    en: "Kaguya Houraisan",
  },
  Tenshi: {
    ja: "比那名居 天子",
    en: "Tenshi Hinanai",
  },
  Sinmyoumaru: {
    ja: "少名 針妙丸",
    en: "Sinmyoumaru Sukuna",
  },
  Satori: {
    ja: "古明地 さとり",
    en: "Satori Komeiji",
  },
  Utsuho: {
    ja: "霊烏路 空",
    en: "Utsuho Reiuji",
  },
  Koishi: {
    ja: "古明地 こいし",
    en: "Koishi Komeiji",
  },
  Ran: {
    ja: "八雲 藍",
    en: "Ran Yakumo",
  },
  Mamizou: {
    ja: "二ッ岩マミゾウ",
    en: "Mamizou Futatsuiwa",
  },
  Nue: {
    ja: "封獣 ぬえ",
    en: "Nue Houjuu",
  },
  Raiko: {
    ja: "堀川 雷鼓",
    en: "Raiko Horikawa",
  },
  Iku: {
    ja: "永江 衣玖",
    en: "Iku Nagae",
  },
  Suika: {
    ja: "伊吹 萃香",
    en: "Suika Ibuki",
  },
  Mokou: {
    ja: "藤原 妹紅",
    en: "Fujiwara no Mokou",
  },
  Yukari: {
    ja: "八雲 紫",
    en: "Yukari Yakumo",
  },
  Reimu: {
    ja: "博麗 霊夢",
    en: "Reimu Hakurei",
  },
  Marisa: {
    ja: "霧雨 魔理沙",
    en: "Marisa Kirisame",
  },
  Doremy: {
    ja: "ドレミー・スイート",
    en: "Doremy Sweet",
  },
  Sumireko: {
    ja: "宇佐見 菫子",
    en: "Sumireko Usami",
  },
};

function convertEnemy(enemy_id: string) {
  return enemyMap[enemy_id] || { ja: "Unknown", en: "white" };
}

function convertEnemyPair(
  enemy1: { ja: string; en: string },
  enemy2: { ja: string; en: string }
) {
  return {
    ja: `${enemy1.ja} & ${enemy2.ja}`,
    en: `${enemy1.en} & ${enemy2.en}`,
  };
}

type Spell = {
  spellCard: { ja: string };
  boss: { ja: string; en: string };
};

// 要件
// 日曜とか2週目日曜とかあるけど基本的には1～21の数字を振ればいい
// ボスのところはボス一人のときはconvertEnemyでボスIDを指定、2人の時はconvertEnemyPairでボスIDを2匹指定
// あとナイトメアダイアリーはゴミ

const spellCardMap: Record<string, Record<string, Spell>> = {
  1: {
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Reimu"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Reimu"),
    },
  },
  2: {
    //月曜日
    1: {
      spellCard: {
        ja: "弾符「イーグルシューティング」",
      },
      boss: convertEnemy("Seiran"),
    },
    2: {
      spellCard: {
        ja: "兎符「ストロベリー大ダンゴ」",
      },
      boss: convertEnemy("Ringo"),
    },
    3: {
      spellCard: {
        ja: "弾符「ラビットファルコナー」",
      },
      boss: convertEnemy("Seiran"),
    },
    4: {
      spellCard: {
        ja: "兎符「ダンゴ三姉妹」",
      },
      boss: convertEnemy("Ringo"),
    },
  },
  3: {
    //火曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Larva"),
    },
    2: {
      spellCard: {
        ja: "蝶符「バタフライドリーム」",
      },
      boss: convertEnemy("Larva"),
    },
    3: {
      spellCard: {
        ja: "蝶符「纏わり付く鱗粉」",
      },
      boss: convertEnemy("Larva"),
    },
  },
  4: {
    //水曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Marisa"),
    },
    2: {
      spellCard: {
        ja: "魔符「慈愛の地蔵」",
      },
      boss: convertEnemy("Narumi"),
    },
    3: {
      spellCard: {
        ja: "地蔵「菩薩ストンプ」",
      },
      boss: convertEnemy("Narumi"),
    },
    4: {
      spellCard: {
        ja: "地蔵「活きの良いバレットゴーレム」",
      },
      boss: convertEnemy("Narumi"),
    },
  },
  5: {
    //木曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Nemuno"),
    },
    2: {
      spellCard: {
        ja: "研符「狂い輝く鬼包丁」",
      },
      boss: convertEnemy("Nemuno"),
    },
    3: {
      spellCard: {
        ja: "殺符「窮僻の山姥」",
      },
      boss: convertEnemy("Nemuno"),
    },
  },
  6: {
    //金曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Aunn"),
    },
    2: {
      spellCard: {
        ja: "独楽「コマ犬大回転」",
      },
      boss: convertEnemy("Aunn"),
    },
    3: {
      spellCard: {
        ja: "独楽「阿吽の閃光」",
      },
      boss: convertEnemy("Aunn"),
    },
  },
  7: {
    //土曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Doremy"),
    },
  },
  8: {
    //日曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Reimu"),
    },
    2: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Reimu"),
    },
  },
  9: {
    //裏・月曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Clownpiece"),
    },
    2: {
      spellCard: {
        ja: "獄符「バースティンググラッジ」",
      },
      boss: convertEnemy("Clownpiece"),
    },
    3: {
      spellCard: {
        ja: "獄符「ダブルストライプ」",
      },
      boss: convertEnemy("Clownpiece"),
    },
    4: {
      spellCard: {
        ja: "月夢「エクリプスナイトメア」",
      },
      boss: convertEnemy("Clownpiece"),
    },
  },
  10: {
    //裏・火曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Sagume"),
    },
    2: {
      spellCard: {
        ja: "玉符「金城鉄壁の陰陽玉」",
      },
      boss: convertEnemy("Sagume"),
    },
    3: {
      spellCard: {
        ja: "玉符「神々の写し難い弾冠」",
      },
      boss: convertEnemy("Sagume"),
    },
    4: {
      spellCard: {
        ja: "夢鷺「片翼の夢鷺」",
      },
      boss: convertEnemy("Sagume"),
    },
  },
  11: {
    //裏・水曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Doremy"),
    },
    2: {
      spellCard: {
        ja: "竹符「バンブーラビリンス」",
      },
      boss: convertEnemy("Mai"),
    },
    3: {
      spellCard: {
        ja: "茗荷「メスメリズムダンス」",
      },
      boss: convertEnemy("Satono"),
    },
    4: {
      spellCard: {
        ja: "笹符「タナバタスタードリーム」",
      },
      boss: convertEnemy("Mai"),
    },
    5: {
      spellCard: {
        ja: "冥加「ビハインドナイトメア」",
      },
      boss: convertEnemy("Satono"),
    },
  },
  12: {
    //裏・木曜日
    1: {
      spellCard: {
        ja: "異界「ディストーテッドファイア」",
      },
      boss: convertEnemy("Hecatia"),
    },
    2: {
      spellCard: {
        ja: "異界「恨みがましい地獄の雨」",
      },
      boss: convertEnemy("Hecatia"),
    },
    3: {
      spellCard: {
        ja: "月「コズミックレディエーション」",
      },
      boss: convertEnemy("Hecatia"),
    },
    4: {
      spellCard: {
        ja: "異界「逢魔ガ刻　夢」",
      },
      boss: convertEnemy("Hecatia"),
    },
    5: {
      spellCard: {
        ja: "「月が堕ちてくる！」",
      },
      boss: convertEnemy("Hecatia"),
    },
  },
  13: {
    //裏・金曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Junko"),
    },
    2: {
      spellCard: {
        ja: "「震え凍える悪夢」",
      },
      boss: convertEnemy("Junko"),
    },
    3: {
      spellCard: {
        ja: "「サイケデリックマンダラ」",
      },
      boss: convertEnemy("Junko"),
    },
    4: {
      spellCard: {
        ja: "「極めて威厳のある純光」",
      },
      boss: convertEnemy("Junko"),
    },
    5: {
      spellCard: {
        ja: "「確実に悪夢で殺す為の弾幕」",
      },
      boss: convertEnemy("Junko"),
    },
  },
  14: {
    //裏・土曜日
    1: {
      spellCard: {
        ja: "秘儀「マターラスッカ」",
      },
      boss: convertEnemy("Okina"),
    },
    2: {
      spellCard: {
        ja: "秘儀「背面の邪炎」",
      },
      boss: convertEnemy("Okina"),
    },
    3: {
      spellCard: {
        ja: "後符「絶対秘神の後光」",
      },
      boss: convertEnemy("Okina"),
    },
    4: {
      spellCard: {
        ja: "秘儀「秘神の暗躍弾幕」",
      },
      boss: convertEnemy("Okina"),
    },
    5: {
      spellCard: {
        ja: "秘儀「神秘の玉繭」",
      },
      boss: convertEnemy("Okina"),
    },
  },
  15: {
    //裏・日曜日
    1: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Reimu"),
    },
    2: {
      spellCard: {
        ja: "夢弾「ルナティックドリームショット」",
      },
      boss: convertEnemy("Seiran"),
    },
    3: {
      spellCard: {
        ja: "団子「ダンゴフラワー」",
      },
      boss: convertEnemy("Ringo"),
    },
    4: {
      spellCard: {
        ja: "夢蝶「クレージーバタフライ」",
      },
      boss: convertEnemy("Larva"),
    },
    5: {
      spellCard: {
        ja: "夢地蔵「劫火の希望」",
      },
      boss: convertEnemy("Narumi"),
    },
    6: {
      spellCard: {
        ja: "夢尽「殺人鬼の懐」",
      },
      boss: convertEnemy("Nemuno"),
    },
    7: {
      spellCard: {
        ja: "夢犬「１０１匹の野良犬」",
      },
      boss: convertEnemy("Aunn"),
    },
  },
  16: {
    //悪夢月曜
    1: {
      spellCard: {
        ja: "妖花符「バタフライストーム閻魔笏」",
      },
      boss: convertEnemyPair(convertEnemy("Yuyuko"), convertEnemy("Eiki")),
    },
    2: {
      spellCard: {
        ja: "風神符「ミシャバシラ」",
      },
      boss: convertEnemyPair(convertEnemy("Kanako"), convertEnemy("Suwako")),
    },
    3: {
      spellCard: {
        ja: "風妖符「死蝶オンバシラ」",
      },
      boss: convertEnemyPair(convertEnemy("Yuyuko"), convertEnemy("Kanako")),
    },
    4: {
      spellCard: {
        ja: "風花符「ミシャグジ様の是非」",
      },
      boss: convertEnemyPair(convertEnemy("Eiki"), convertEnemy("Suwako")),
    },
    5: {
      spellCard: {
        ja: "妖風符「土着蝶ストーム」",
      },
      boss: convertEnemyPair(convertEnemy("Yuyuko"), convertEnemy("Suwako")),
    },
    6: {
      spellCard: {
        ja: "風花符「オンバシラ裁判」",
      },
      boss: convertEnemyPair(convertEnemy("Eiki"), convertEnemy("Kanako")),
    },
  },
  17: {
    //悪夢火曜
    1: {
      spellCard: {
        ja: "永夜符「蓬莱壺中の弾の枝」",
      },
      boss: convertEnemyPair(convertEnemy("Eirin"), convertEnemy("Kaguya")),
    },
    2: {
      spellCard: {
        ja: "緋針符「要石も大きくなあれ」",
      },
      boss: convertEnemyPair(
        convertEnemy("Tenshi"),
        convertEnemy("Sinmyoumaru")
      ),
    },
    3: {
      spellCard: {
        ja: "永緋符「墜落する壺中の有頂天」",
      },
      boss: convertEnemyPair(convertEnemy("Eirin"), convertEnemy("Tenshi")),
    },
    4: {
      spellCard: {
        ja: "輝夜符「蓬莱の大きな弾の枝」",
      },
      boss: convertEnemyPair(
        convertEnemy("Kaguya"),
        convertEnemy("Sinmyoumaru")
      ),
    },
    5: {
      spellCard: {
        ja: "永輝符「大きくなる壺」",
      },
      boss: convertEnemyPair(
        convertEnemy("Eirin"),
        convertEnemy("Sinmyoumaru")
      ),
    },
    6: {
      spellCard: {
        ja: "緋夜符「蓬莱の弾の要石」",
      },
      boss: convertEnemyPair(convertEnemy("Kaguya"), convertEnemy("Tenshi")),
    },
  },
  18: {
    //悪夢水曜
    1: {
      spellCard: {
        ja: "地霊符「マインドステラスチール」",
      },
      boss: convertEnemyPair(convertEnemy("Satori"), convertEnemy("Utsuho")),
    },
    2: {
      spellCard: {
        ja: "地妖符「イドの式神」",
      },
      boss: convertEnemyPair(convertEnemy("Koishi"), convertEnemy("Ran")),
    },
    3: {
      spellCard: {
        ja: "「パーフェクトマインドコントロール」",
      },
      boss: convertEnemyPair(convertEnemy("Koishi"), convertEnemy("Satori")),
    },
    4: {
      spellCard: {
        ja: "地妖符「式神大星」",
      },
      boss: convertEnemyPair(convertEnemy("Utsuho"), convertEnemy("Ran")),
    },
    5: {
      spellCard: {
        ja: "地妖符「エゴの式神」",
      },
      boss: convertEnemyPair(convertEnemy("Satori"), convertEnemy("Ran")),
    },
    6: {
      spellCard: {
        ja: "地霊符「マインドステラリリーフ」",
      },
      boss: convertEnemyPair(convertEnemy("Utsuho"), convertEnemy("Koishi")),
    },
  },
  19: {
    //悪夢木曜
    1: {
      spellCard: {
        ja: "神星符「正体不明の怪光人だかり」",
      },
      boss: convertEnemyPair(convertEnemy("Mamizou"), convertEnemy("Nue")),
    },
    2: {
      spellCard: {
        ja: "輝天符「迅雷のドンドコ太鼓」",
      },
      boss: convertEnemyPair(convertEnemy("Iku"), convertEnemy("Raiko")),
    },
    3: {
      spellCard: {
        ja: "輝神符「謎のドンドコ人だかり」",
      },
      boss: convertEnemyPair(convertEnemy("Mamizou"), convertEnemy("Raiko")),
    },
    4: {
      spellCard: {
        ja: "緋星符「正体不明の落雷」",
      },
      boss: convertEnemyPair(convertEnemy("Nue"), convertEnemy("Iku")),
    },
    5: {
      spellCard: {
        ja: "神緋符「雷雨の中のストーカー」",
      },
      boss: convertEnemyPair(convertEnemy("Mamizou"), convertEnemy("Iku")),
    },
    6: {
      spellCard: {
        ja: "輝星符「正体不明のドンドコ太鼓」",
      },
      boss: convertEnemyPair(convertEnemy("Nue"), convertEnemy("Raiko")),
    },
  },
  20: {
    //悪夢金曜
    1: {
      spellCard: {
        ja: "萃夜符「身命霧散」",
      },
      boss: convertEnemyPair(convertEnemy("Suika"), convertEnemy("Mokou")),
    },
    2: {
      spellCard: {
        ja: "紺珠符「純粋と不純の弾幕」",
      },
      boss: convertEnemyPair(convertEnemy("Hecatia"), convertEnemy("Junko")),
    },
    3: {
      spellCard: {
        ja: "萃珠符「純粋な五里霧中」",
      },
      boss: convertEnemyPair(convertEnemy("Junko"), convertEnemy("Suika")),
    },
    4: {
      spellCard: {
        ja: "永珠符「捨て身のリフレクション」",
      },
      boss: convertEnemyPair(convertEnemy("Hecatia"), convertEnemy("Mokou")),
    },
    5: {
      spellCard: {
        ja: "萃珠符「ミストレイ」",
      },
      boss: convertEnemyPair(convertEnemy("Hecatia"), convertEnemy("Suika")),
    },
    6: {
      spellCard: {
        ja: "永珠符「穢れ無き珠と穢れ多き霊」",
      },
      boss: convertEnemyPair(convertEnemy("Junko"), convertEnemy("Mokou")),
    },
  },
  21: {
    //悪夢土曜
    1: {
      spellCard: {
        ja: "「秘神結界」",
      },
      boss: convertEnemyPair(convertEnemy("Okina"), convertEnemy("Yukari")),
    },
    2: {
      spellCard: {
        ja: "「盗撮者調伏マスタースパーク」",
      },
      boss: convertEnemyPair(convertEnemy("Reimu"), convertEnemy("Marisa")),
    },
    3: {
      spellCard: {
        ja: "「背後からの盗撮者調伏」",
      },
      boss: convertEnemyPair(convertEnemy("Okina"), convertEnemy("Reimu")),
    },
    4: {
      spellCard: {
        ja: "「弾幕結界を撃ち抜け！」",
      },
      boss: convertEnemyPair(convertEnemy("Yukari"), convertEnemy("Marisa")),
    },
    5: {
      spellCard: {
        ja: "「卑怯者マスタースパーク」",
      },
      boss: convertEnemyPair(convertEnemy("Okina"), convertEnemy("Marisa")),
    },
    6: {
      spellCard: {
        ja: "「許可無く弾幕は撮影禁止です」",
      },
      boss: convertEnemyPair(convertEnemy("Reimu"), convertEnemy("Yukari")),
    },
  },
  22: {
    //悪夢日曜
    1: {
      spellCard: {
        ja: "紅魔符「ブラッディカタストロフ」",
      },
      boss: convertEnemyPair(convertEnemy("Remilia"), convertEnemy("Flandre")),
    },
    2: {
      spellCard: {
        ja: "星神符「十七条の超人」",
      },
      boss: convertEnemyPair(convertEnemy("Byakuren"), convertEnemy("Miko")),
    },
    3: {
      spellCard: {
        ja: "紅星符「超人ブラッディナイフ」",
      },
      boss: convertEnemyPair(convertEnemy("Remilia"), convertEnemy("Byakuren")),
    },
    4: {
      spellCard: {
        ja: "「十七条のカタストロフ」",
      },
      boss: convertEnemyPair(convertEnemy("Flandre"), convertEnemy("Miko")),
    },
    5: {
      spellCard: {
        ja: "神紅符「ブラッディ十七条のレーザー」",
      },
      boss: convertEnemyPair(convertEnemy("Remilia"), convertEnemy("Miko")),
    },
    6: {
      spellCard: {
        ja: "紅星符「超人カタストロフ行脚」",
      },
      boss: convertEnemyPair(convertEnemy("Flandre"), convertEnemy("Byakuren")),
    },
  },
  23: {
    //ナイトメアダイアリー
    1: {
      spellCard: {
        ja: "「最後の日曜日に見る悪夢」",
      },
      boss: convertEnemy("Doremy"),
    },
    2: {
      spellCard: {
        ja: "「ＥＳＰカード手裏剣」",
      },
      boss: convertEnemy("Sumireko"),
    },
    3: {
      spellCard: {
        ja: "紙符「結界中のＥＳＰカード手裏剣」",
      },
      boss: convertEnemyPair(convertEnemy("Sumireko"), convertEnemy("Yukari")),
    },
    4: {
      spellCard: {
        ja: "通常弾幕",
      },
      boss: convertEnemy("Sumireko"),
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

const levelMap: Record<string, { ja: string }> = {
  1: { ja: "日曜日" },
  2: { ja: "月曜日" },
  3: { ja: "火曜日" },
  4: { ja: "水曜日" },
  5: { ja: "木曜日" },
  6: { ja: "金曜日" },
  7: { ja: "土曜日" },
  8: { ja: "裏・日曜日" },
  9: { ja: "裏・月曜日" },
  10: { ja: "裏・火曜日" },
  11: { ja: "裏・水曜日" },
  12: { ja: "裏・木曜日" },
  13: { ja: "裏・金曜日" },
  14: { ja: "裏・土曜日" },
  15: { ja: "悪夢日曜" },
  16: { ja: "悪夢月曜" },
  17: { ja: "悪夢火曜" },
  18: { ja: "悪夢水曜" },
  19: { ja: "悪夢木曜" },
  20: { ja: "悪夢金曜" },
  21: { ja: "悪夢土曜" },
  22: { ja: "ナイトメアダイアリー" },
};

function convertLevel(level: string) {
  return levelMap[level] || { ja: "不明" };
}

interface Th165Replay {
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
    level: string;
    scene: string;
    total_score: string;
    slowdown: string;
    timestamp: string;
    spell_card_id: string;
    stage_details: [];
  };
}

export function Th165Table(replay: Th165Replay) {
  let difficultyColor = "white";
  if (Number(replay.replay_meta.level) <= 7) {
    difficultyColor = useTableUtils().convertDifficulty("0").color;
  } else if (Number(replay.replay_meta.level) <= 14) {
    difficultyColor = useTableUtils().convertDifficulty("1").color;
  } else if (Number(replay.replay_meta.level) <= 21) {
    difficultyColor = useTableUtils().convertDifficulty("2").color;
  } else {
    difficultyColor = useTableUtils().convertDifficulty("3").color;
  }

  return {
    game_meta: {
      theme_color: "#AE11D5",
      img: {
        thumb: "/images/thumb/th165.png",
        full: "/images/full/th165.png",
        alt: "th165",
      },
      name: "秘封ナイトメアダイアリー 〜 Violet Detector.",
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
    total_score: null,
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
        convertLevel(String(replay.replay_meta.level)).ja +
        " - " +
        String(replay.replay_meta.scene),
      color: difficultyColor,
    },
    shot_type: null,
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
