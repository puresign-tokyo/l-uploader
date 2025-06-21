import { useTableUtils } from "./TableUtils"

const enemyMap: Record<string, {ja: string, en: string}> = {
  Wakasagihime: {
    ja: 'わかさぎ姫',
    en: 'Wakasagihime'
  },
  Cirno: {
    ja: 'チルノ',
    en: 'Cirno'
  },
  Kyouko: {
    ja: '幽谷 響子',
    en: 'Kyouko Kasodani'
  },
  Sekibanki: {
    ja: '赤蛮奇',
    en: 'Sekibanki'
  },
  Kagerou: {
    ja: '今泉 影狼',
    en: 'Kagerou Imaizumi'
  },
  Keine: {
    ja: '上白沢 慧音',
    en: 'Keine Kamishirasawa'
  },
  Mokou: {
    ja: '藤原 妹紅',
    en: 'Fujiwara no Mokou'
  },
  Yoshika: {
    ja: '宮古 芳香',
    en: 'Yoshika Miyako'
  },
  Seiga: {
    ja: '霍 青娥',
    en: 'Seiga Kaku'
  },
  Yuyuko: {
    ja: '西行寺 幽々子',
    en: 'Yuyuko Saigyouji'
  },
  Yatsuhashi: {
    ja: '九十九 八橋',
    en: 'Yatsuhashi Tsukumo'
  },
  Benben: {
    ja: '九十九 弁々',
    en: 'Benben Tsukumo'
  },
  Tsukumo: {
    ja: '九十九姉妹',
    en: 'Tsukumo sisters'
  },
  Raiko: {
    ja: '堀川 雷鼓',
    en: 'Raiko Horikawa'
  },
  Aya: {
    ja: '射命丸 文',
    en: 'Aya Shameimaru'
  },
  Hatate: {
    ja: '姫海棠 はたて',
    en: 'Hatate Himekaidou'
  },
  Nitori: {
    ja: '河城 にとり',
    en: 'Nitori Kawashiro'
  },
  Momiji: {
    ja: '犬走 椛',
    en: 'Momiji Inubashiri'
  },
  Marisa: {
    ja: '霧雨 魔理沙',
    en: 'Marisa Kirisame'
  },
  Sakuya: {
    ja: '十六夜 咲夜',
    en: 'Sakuya Izayoi'
  },
  Youmu: {
    ja: '魂魄 妖夢',
    en: 'Youmu Konpaku'
  },
  Sanae: {
    ja: '東風谷 早苗',
    en: 'Sanae Kochiya'
  },
  Reimu: {
    ja: '博麗 霊夢',
    en: 'Reimu Hakurei'
  },
  Mamizou: {
    ja: '二ッ岩マミゾウ',
    en: 'Mamizou Futatsuiwa'
  },
  Sinmyoumaru: {
    ja: '少名 針妙丸',
    en: 'Sinmyoumaru Sukuna'
  },
  Kanako: {
    ja: '八坂 神奈子',
    en: 'Kanako Yasaka'
  },
  Suwako: {
    ja: '洩矢 諏訪子',
    en: 'Suwako Moriya'
  },
  Futo: {
    ja: '物部 布都',
    en: 'Mononobe no Futo'
  },
  Suika: {
    ja: '伊吹 萃香',
    en: 'Suika Ibuki'
  },
  Byakuren: {
    ja: '聖 白蓮',
    en: 'Byakuren Hijiri'
  },
  Miko: {
    ja: '豊聡耳 神子',
    en: 'Toyosatomimi no Miko'
  },
  Tenshi: {
    ja: '比那名居 天子',
    en: 'Tenshi Hinanai'
  },
  Remilia: {
    ja: 'レミリア・スカーレット',
    en: 'Remilia Scarlet'
  },
  Yukari: {
    ja: '八雲紫',
    en: 'Yukari Yakumo'
  }
}

function convertEnemy(enemy_id: string){
  return enemyMap[enemy_id] || {ja: 'Unknown', en: 'white'}
}

type Spell = {
  spellCard: {ja: string};
  boss: {ja: string, en: string};
}


const spellCardMap: Record<string, Record<string, Spell>>={
  1: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Yatsuhashi')
    },
    2: {
      spellCard: {
        ja: '水符「ルナティックレッドスラップ」'
      },
      boss: convertEnemy('Wakasagihime')
    },
    3: {
      spellCard: {
        ja: '氷符「パーフェクトグレーシェリスト」'
      },
      boss: convertEnemy('Cirno')
    },
    4: {
      spellCard: {
        ja: '潮符「湖のタイダルウェイブ」'
      },
      boss: convertEnemy('Wakasagihime')
    },
    5: {
      spellCard: {
        ja: '氷王「フロストキング」'
      },
      boss: convertEnemy('Cirno')
    },
    6: {
      spellCard: {
        ja: '魚符「スクールオブフィッシュ」'
      },
      boss: convertEnemy('Wakasagihime')
    }
  },
  2: {
    1: {
      spellCard: {
        ja: '叫喚「プライマルスクリーム」'
      },
      boss: convertEnemy('Kyouko')
    },
    2: {
      spellCard: {
        ja: '飛首「エクストリームロングネック」'
      },
      boss: convertEnemy('Sekibanki')
    },
    3: {
      spellCard: {
        ja: '劈音「ピアッシングサークル」'
      },
      boss: convertEnemy('Kyouko')
    },
    4: {
      spellCard: {
        ja: '眼光「ヘルズレイ」'
      },
      boss: convertEnemy('Sekibanki')
    },
    5: {
      spellCard: {
        ja: '御経「無限念仏」'
      },
      boss: convertEnemy('Kyouko')
    },
    6: {
      spellCard: {
        ja: '飛首「ツインロクロヘッド」'
      },
      boss: convertEnemy('Sekibanki')
    }
  },
  3: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Kagerou')
    },
    2: {
      spellCard: {
        ja: '満月「フルムーンロア」'
      },
      boss: convertEnemy('Kagerou')
    },
    3: {
      spellCard: {
        ja: '「２０ＸＸ年　死後の旅」'
      },
      boss: convertEnemy('Keine')
    },
    4: {
      spellCard: {
        ja: '惜命「不死身の捨て身」'
      },
      boss: convertEnemy('Mokou')
    },
    5: {
      spellCard: {
        ja: '狼牙「血に餓えたウルフファング」'
      },
      boss: convertEnemy('Kagerou')
    },
    6: {
      spellCard: {
        ja: '大火「江戸のフラワー」'
      },
      boss: convertEnemy('Keine')
    },
    7: {
      spellCard: {
        ja: '「火の鳥 ―不死伝説―」'
      },
      boss: convertEnemy('Mokou')
    }
  },
  4: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Yuyuko')
    },
    2: {
      spellCard: {
        ja: '入魔「過剰ゾウフォルゥモォ」'
      },
      boss: convertEnemy('Seiga')
    },
    3: {
      spellCard: {
        ja: '蝶符「花蝶風月」'
      },
      boss: convertEnemy('Yuyuko')
    },
    4: {
      spellCard: {
        ja: '毒爪「ゾンビクロー」'
      },
      boss: convertEnemy('Yoshika')
    },
    5: {
      spellCard: {
        ja: '仙術「ウォールランナー」'
      },
      boss: convertEnemy('Seiga')
    },
    6: {
      spellCard: {
        ja: '桜花「桜吹雪花小町」'
      },
      boss: convertEnemy('Yuyuko')
    },
    7: {
      spellCard: {
        ja: '仙術「壁抜けワームホール」'
      },
      boss: convertEnemy('Seiga')
    }
  },
  5: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Raiko')
    },
    2: {
      spellCard: {
        ja: '琴符「天の詔琴」'
      },
      boss: convertEnemy('Yatsuhashi')
    },
    3: {
      spellCard: {
        ja: '音符「大熱唱琵琶」'
      },
      boss: convertEnemy('Benben')
    },
    4: {
      spellCard: {
        ja: '雷符「怒りのデンデン太鼓」'
      },
      boss: convertEnemy('Raiko')
    },
    5: {
      spellCard: {
        ja: '哀歌「人琴ともに亡ぶ」'
      },
      boss: convertEnemy('Yatsuhashi')
    },
    6: {
      spellCard: {
        ja: '楽譜「スコアウェブ」'
      },
      boss: convertEnemy('Benben')
    },
    7: {
      spellCard: {
        ja: '太鼓「ファンタジックウーファー」'
      },
      boss: convertEnemy('Raiko')
    },
    8: {
      spellCard: {
        ja: '両吟「星降る唄」'
      },
      boss: convertEnemy('Tsukumo')
    }
  },
  6: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Mamizou')
    },
    2: {
      spellCard: {
        ja: '写真「激撮テングスクープ」'
      },
      boss: convertEnemy('Aya')
    },
    3: {
      spellCard: {
        ja: '写真「フルパノラマショット」'
      },
      boss: convertEnemy('Hatate')
    },
    4: {
      spellCard: {
        ja: '瀑符「シライトフォール」'
      },
      boss: convertEnemy('Nitori')
    },
    5: {
      spellCard: {
        ja: '牙符「咀嚼玩味」'
      },
      boss: convertEnemy('Momiji')
    },
    6: {
      spellCard: {
        ja: '瀑符「ケゴンガン」'
      },
      boss: convertEnemy('Nitori')
    },
    7: {
      spellCard: {
        ja: '写真「籠もりパパラッチ」'
      },
      boss: convertEnemy('Hatate')
    },
    8: {
      spellCard: {
        ja: '「瞬撮ジャーナリスト」'
      },
      boss: convertEnemy('Aya')
    }
  },
  7: {
    1: {
      spellCard: {
        ja: '恋符「ワイドマスター」'
      },
      boss: convertEnemy('Marisa')
    },
    2: {
      spellCard: {
        ja: '時符「タイムストッパー咲夜」'
      },
      boss: convertEnemy('Sakuya')
    },
    3: {
      spellCard: {
        ja: '光符「冥府光芒一閃」'
      },
      boss: convertEnemy('Youmu')
    },
    4: {
      spellCard: {
        ja: '蛇符「バインドスネークカモン」'
      },
      boss: convertEnemy('Sanae')
    },
    5: {
      spellCard: {
        ja: '恋符「マシンガンスパーク」'
      },
      boss: convertEnemy('Marisa')
    },
    6: {
      spellCard: {
        ja: '時符「チェンジリングマジック」'
      },
      boss: convertEnemy('Sakuya')
    },
    7: {
      spellCard: {
        ja: '彼岸剣「地獄極楽滅多斬り」'
      },
      boss: convertEnemy('Youmu')
    },
    8: {
      spellCard: {
        ja: '蛇符「グリーンスネークカモン」'
      },
      boss: convertEnemy('Sanae')
    }
  },
  8: {
    1: {
      spellCard: {
        ja: '通常弾幕'
      },
      boss: convertEnemy('Sinmyoumaru')
    },
    2: {
      spellCard: {
        ja: '神籤「反則結界」'
      },
      boss: convertEnemy('Reimu')
    },
    3: {
      spellCard: {
        ja: '「鳴かぬなら泣くまで待とう時鳥」'
      },
      boss: convertEnemy('Mamizou')
    },
    4: {
      spellCard: {
        ja: '「小人の地獄」'
      },
      boss: convertEnemy('Sinmyoumaru')
    },
    5: {
      spellCard: {
        ja: '「パスウェイジョンニードル」'
      },
      boss: convertEnemy('Reimu')
    },
    6: {
      spellCard: {
        ja: '「にんげんって良いな」'
      },
      boss: convertEnemy('Mamizou')
    },
    7: {
      spellCard: {
        ja: '輝針「鬼ごろし両目突きの針」'
      },
      boss: convertEnemy('Sinmyoumaru')
    }
  },
  9: {
    1: {
      spellCard: {
        ja: '御柱「ライジングオンバシラ」'
      },
      boss: convertEnemy('Kanako')
    },
    2: {
      spellCard: {
        ja: '緑石「ジェイドブレイク」'
      },
      boss: convertEnemy('Suwako')
    },
    3: {
      spellCard: {
        ja: '古舟「エンシェントシップ」'
      },
      boss: convertEnemy('Futo')
    },
    4: {
      spellCard: {
        ja: '鬼群「インプスウォーム」'
      },
      boss: convertEnemy('Suika')
    },
    5: {
      spellCard: {
        ja: '「神の御威光」'
      },
      boss: convertEnemy('Kanako')
    },
    6: {
      spellCard: {
        ja: '蛙符「血塗られた赤蛙塚」'
      },
      boss: convertEnemy('Suwako')
    },
    7: {
      spellCard: {
        ja: '熱龍「火焔龍脈」'
      },
      boss: convertEnemy('Futo')
    },
    8: {
      spellCard: {
        ja: '鬼群「百鬼禿童」'
      },
      boss: convertEnemy('Suika')
    }
  },
  10: {
    1: {
      spellCard: {
        ja: '「ハリの制縛」'
      },
      boss: convertEnemy('Byakuren')
    },
    2: {
      spellCard: {
        ja: '「我こそが天道なり」'
      },
      boss: convertEnemy('Miko')
    },
    3: {
      spellCard: {
        ja: '「全妖怪の緋想天」'
      },
      boss: convertEnemy('Tenshi')
    },
    4: {
      spellCard: {
        ja: '「フィットフルナイトメア」'
      },
      boss: convertEnemy('Remilia')
    },
    5: {
      spellCard: {
        ja: '「不可能弾幕結界」'
      },
      boss: convertEnemy('Yukari')
    },
    6: {
      spellCard: {
        ja: '「ブラフマーの瞳」'
      },
      boss: convertEnemy('Byakuren')
    },
    7: {
      spellCard: {
        ja: '「十七条の憲法爆弾」'
      },
      boss: convertEnemy('Miko')
    },
    8: {
      spellCard: {
        ja: '「鹿島鎮護」'
      },
      boss: convertEnemy('Tenshi')
    },
    9: {
      spellCard: {
        ja: '「きゅうけつ鬼ごっこ」'
      },
      boss: convertEnemy('Remilia')
    },
    10: {
      spellCard: {
        ja: '「運鈍根の捕物帖」'
      },
      boss: convertEnemy('Yukari')
    }
  }
}

function convertSpellCard(level: string, scene: string){
  return spellCardMap[level][scene] || {spellCard: {ja: 'Unknown'}, boss: {ja: 'Unknown', en: 'Unknwon'}}
}

interface Th143Replay{
  replay_id: string,
  game_id: string,
  user_name: string,
  uploaded_at: string,
  upload_comment: string,
  category: string,
  optional_tag: string,
  filename: string,
  replay_meta: {
    name: string,
    level: string,
    scene: string,
    total_score: string,
    slowdown: string,
    timestamp: string,
    spell_card_id: string,
    stage_details: []
  }
}

export function Th143Table(replay: Th143Replay){

  let difficultyColor='white'
  if (Number(replay.replay_meta.level)<=3){
    difficultyColor=useTableUtils().convertDifficulty('0').color
  }else if(Number(replay.replay_meta.level)<=6){
    difficultyColor=useTableUtils().convertDifficulty('1').color
  }else if(Number(replay.replay_meta.level)<=8){
    difficultyColor=useTableUtils().convertDifficulty('2').color
  }else{
    difficultyColor=useTableUtils().convertDifficulty('3').color
  }

  return{
    game_meta:{
      theme_color: '#B6423C',
      img: {img: '/images/th143.png', alt: 'th143'},
      name: '弾幕アマノジャク 〜 Impossible Spell Card.'
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: (Number(replay.replay_meta.slowdown)).toFixed(2) + '%',
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}),
    difficulty: {label: String(replay.replay_meta.level)+'-'+String(replay.replay_meta.scene), color: difficultyColor},
    shot_type: null,
    optional_division: {label: convertSpellCard(String(replay.replay_meta.level), String(replay.replay_meta.scene)).spellCard.ja, color: 'light-blue-darken-3'},
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: null,
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id
  }
}