import { useTableUtils } from "./TableUtils"
const enemyMap: Record<string, {ja: string, en: string}>={
  Wriggle :{
    ja: "リグル・ナイトバグ",
    en: "Wriggle Nightbug"
  },
  Rumia: {
      ja: "ルーミア",
      en: "Rumia"
  },
  Cirno: {
      ja: "チルノ",
      en: "Cirno"
  },
  Letty: {
    ja: "レティ・ホワイトロック",
    en: "Letty Whiterock"
  },
  Alice: {
    ja: "アリス・マーガトロイド",
    en: "Alice Margatroid"
  },
  Keine: {
    ja: "上白沢 慧音",
    en: "Keine Kamishirasawa"
  },
  Reisen: {
    ja: "鈴仙・優曇華院・イナバ",
    en: "Reisen Udongein Inaba"
  },
  Medicine: {
    ja: "メディスン・メランコリー",
    en: "Medicine Melancholy"
  },
  Tewi: {
    ja: "因幡 てゐ",
    en: "Tewi Inaba"
  },
  Meiling: {
    ja: "紅 美鈴",
    en: "Hong Meiling"
  },
  Patchouli: {
    ja: "パチュリー・ノーレッジ",
    en: "Patchouli Knowledge"
  },
  Chen: {
    ja: "橙",
    en: "Chen"
  },
  Youmu: {
    ja: "魂魄 妖夢",
    en: "Youmu Konpaku"
  },
  Sakuya: {
    ja: "十六夜 咲夜",
    en: "Sakuya Izayoi"
  },
  Remilia: {
    ja: "レミリア・スカーレット",
    en: "Remilia Scarlet"
  },
  Ran: {
    ja: "八雲 藍",
    en: "Ran Yakumo"
  },
  Yuyuko: {
    ja: "西行寺 幽々子",
    en: "Yuyuko Saigyouji"
  },
  Eirin: {
    ja: "八意 永琳",
    en: "Eirin Yagokoro"
  },
  Kaguya: {
    ja: "蓬莱山 輝夜",
    en: "Kaguya Houraisan"
  },
  Komachi: {
    ja: "小野塚 小町",
    en: "Komachi Onozuka"
  },
  Eiki: {
    ja: "四季映姫・ヤマザナドゥ",
    en: "Eiki Shiki, Yamaxanadu"
  },
  Flandre: {
    ja: "フランドール・スカーレット",
    en: "Frandre Scarlet"
  },
  Yukari: {
    ja: "八雲 紫",
    en: "Yukari Yakumo"
  },
  Mokou: {
    ja: "藤原 妹紅",
    en: "Fujiwara no Mokou"
  },
  Suika: {
    ja: "伊吹 萃香",
    en: "Suika Ibuki"
  }
}

function convertEnemy(enemy_id: string){
  return enemyMap[enemy_id] || {ja: 'Unknown', en: 'white'}
}

type Spell = {
  spellCard: {ja: string, en: string};
  boss: {ja: string, en: string};
}

const spellCardMap: Record<string, Record<string, Spell>> = {
  1: {
    1: {
      boss: convertEnemy("Wriggle"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Rumia"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    3: {
      boss: convertEnemy("Wriggle"),
      spellCard: {
        ja: '蛍符「地上の恒星」',
        en: 'Firefly Sign "Fixed Stars on Earth"'
      }
    },
    4: {
      boss: convertEnemy("Rumia"),
      spellCard: {
        ja: '闇符「ダークサイドオブザムーン」',
        en: 'Darkness Sign "Dark Side of the Moon"'
      }
    },
    5: {
      boss: convertEnemy("Wriggle"),
      spellCard: {
        ja: '蝶符「バタフライストーム」',
        en: 'Butterfly Sign "Butterfly Storm"'
      }
    },
    6: {
      boss: convertEnemy("Rumia"),
      spellCard: {
        ja: '夜符「ミッドナイトバード」',
        en: 'Night Sign "Midnight Bird"'
      }
    }
},
2: {
    1: {
      boss: convertEnemy("Cirno"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Letty"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    3: {
      boss: convertEnemy("Cirno"),
      spellCard: {
        ja: '雪符「ダイアモンドブリザード」',
        en: 'Snow Sign "Diamond Blizzard"	'
      }
    },
    4: {
      boss: convertEnemy("Letty"),
      spellCard: {
        ja: '寒符「コールドスナップ」',
        en: 'Cold Sign "Cold Snap"'
      }
    },
    5: {
      boss: convertEnemy("Cirno"),
      spellCard: {
        ja: '凍符「マイナスＫ」',
        en: 'Freeze Sign "Minus K"'
      }
    },
    6: {
      boss: convertEnemy("Letty"),
      spellCard: {
        ja: '冬符「ノーザンウイナー」',
        en: 'Winter Sign "Northern Winner"'
      }
    }
  },
  3: {
    1: {
      boss: convertEnemy("Alice"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Keine"),
      spellCard: {
        ja: '3-2 光符「アマテラス」',
        en: 'Light Sign "Amaterasu"'
      }
    },
    3: {
      boss: convertEnemy("Alice"),
      spellCard: {
        ja: '操符「ドールズインシー」',
        en: 'Puppeteer Sign "Dolls in Sea"'
      }
    },
    4: {
      boss: convertEnemy("Keine"),
      spellCard: {
        ja: '包符「昭和の雨」',
        en: 'Shroud Sign "Rain of Showa"'
      }
    },
    5: {
      boss: convertEnemy("Alice"),
      spellCard: {
        ja: '呪符「ストロードールカミカゼ」',
        en: 'Curse Sign "Straw Doll Kamikaze"'
      }
    },
    6: {
      boss: convertEnemy("Keine"),
      spellCard: {
        ja: '葵符「水戸の光圀」',
        en: 'Hollyhock Sign "Mito no Mitsukuni"'
      }
    },
    7: {
      boss: convertEnemy("Alice"),
      spellCard: {
        ja: '赤符「ドールミラセティ」',
        en: 'Red Sign "Doll Mira Ceti"'
      }
    },
    8: {
      boss: convertEnemy("Keine"),
      spellCard: {
        ja: '倭符「邪馬台の国」',
        en: 'Japan Sign "Yamato Kingdom"'
      }
    }
  },
  4: {
    1: {
      boss: convertEnemy("Reisen"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Medicine"),
      spellCard: {
        ja: '霧符「ガシングガーデン」',
        en: 'Fog Sign "Gassing Garden"'
      }
    },
    3: {
      boss: convertEnemy("Tewi"),
      spellCard: {
        ja: '脱兎「フラスターエスケープ」',
        en: 'Runaway Rabbit "Fluster Escape"'
      }
    },
    4: {
      boss: convertEnemy("Reisen"),
      spellCard: {
        ja: '散符「朧月花栞（ロケット・イン・ミスト）」',
        en: 'Spread Sign "Hazy Moon Flower Bookmark (Rocket in Mist)'
      }
    },
    5: {
      boss: convertEnemy("Medicine"),
      spellCard: {
        ja: '毒符「ポイズンブレス」',
        en: 'Poison Sign "Poison Breath"'
      }
    },
    6: {
      boss: convertEnemy("Reisen"),
      spellCard: {
        ja: '波符「幻の月（インビジブルハーフムーン）」',
        en: 'Wave Sign "Moon of Illusion (Invisible Half-Moon)"'
      }
    },
    7: {
      boss: convertEnemy("Medicine"),
      spellCard: {
        ja: '譫妄「イントゥデリリウム」',
        en: 'Confusion "Into Delirium"'
      }
    },
    8: {
      boss: convertEnemy("Tewi"),
      spellCard: {
        ja: '借符「大穴牟遅様の薬」',
        en: 'Owing Sign "Vulnerary of Ohnamuji-sama"'
      }
    },
    9: {
      boss: convertEnemy("Reisen"),
      spellCard: {
        ja: '狂夢「風狂の夢（ドリームワールド）」',
        en: 'Mad Dream "Drean of Insanity (Dream World)"'
      }
    }
  },
  5: {
    1: {
      boss: convertEnemy("Meiling"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Patchouli"),
      spellCard: {
        ja: '日＆水符「ハイドロジェナスプロミネンス」',
        en: 'Sun & Water Sign "Hydrogenous Prominence"'
      }
    },
    3: {
      boss: convertEnemy("Meiling"),
      spellCard: {
        ja: '華符「彩光蓮華掌」',
        en: 'Flower Sign "Colorful Light Lotus Flower Palm"'
      }
    },
    4: {
      boss: convertEnemy("Patchouli"),
      spellCard: {
        ja: '水＆火符「フロギスティックレイン」',
        en: 'Water Fire Sign "Phlogistic Rain"'
      }
    },
    5: {
      boss: convertEnemy("Meiling"),
      spellCard: {
        ja: '彩翔「飛花落葉」',
        en: 'Colorful Flip "Fluttering Petals and Falling Leaves"'
      }
    },
    6: {
      boss: convertEnemy("Patchouli"),
      spellCard: {
        ja: '月＆木符「サテライトヒマワリ」',
        en: 'Moon Wood Sign "Satellite Himawari"'
      }
    },
    7: {
      boss: convertEnemy("Meiling"),
      spellCard: {
        ja: '彩華「虹色太極拳」',
        en: 'Colorful Chinese Flower "Rainbow Taijiquan"'
      }
    },
    8: {
      boss: convertEnemy("Patchouli"),
      spellCard: {
        ja: '日＆月符「ロイヤルダイアモンドリング」',
        en: 'Sun Moon Sign "Royal Diamond Ring"'
      }
    }
  },
  6: {
    1: {
      boss: convertEnemy("Chen"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Youmu"),
      spellCard: {
        ja: '人智剣「天女返し」',
        en: 'Human Knowledge Sword "Turning Angel Cut"'
      }
    },
    3: {
      boss: convertEnemy("Chen"),
      spellCard: {
        ja: '星符「飛び重ね鱗」',
        en: 'Star Sign "Leaping Kasane-Uroko Star"'
      }
    },
    4: {
      boss: convertEnemy("Youmu"),
      spellCard: {
        ja: '妄執剣「修羅の血」',
        en: 'Obsession Sword "Blood of Asura"'
      }
    },
    5: {
      boss: convertEnemy("Chen"),
      spellCard: {
        ja: '鬼神「鳴動持国天」',
        en: 'Kishin "Rumbling Jikokuten"'
      }
    },
    6: {
      boss: convertEnemy("Youmu"),
      spellCard: {
        ja: '天星剣「涅槃寂静の如し」',
        en: 'Celestial Star Sword "As the Silent Nirvana"'
      }
    },
    7: {
      boss: convertEnemy("Chen"),
      spellCard: {
        ja: '化猫「橙」',
        en: 'Bakeneko "Chen"'
      }
    },
    8: {
      boss: convertEnemy("四生剣「衆生無情の響き」"),
      spellCard: {
        ja: '四生剣「衆生無情の響き」',
        en: 'Four Births Sword "Echoes of the Inclemency of All Beings"'
      }
    },
  },
  7: {
    1: {
      boss: convertEnemy("Sakuya"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Remilia"),
      spellCard: {
        ja: '魔符「全世界ナイトメア」',
        en: 'Devil Sign "All the World in Nightmare"'
      }
    },
    3: {
      boss: convertEnemy("Sakuya"),
      spellCard: {
        ja: '時符「トンネルエフェクト」',
        en: 'Time Sign "Tunnel Effect"'
      }
    },
    4: {
      boss: convertEnemy("Remilia"),
      spellCard: {
        ja: '紅符「ブラッディマジックスクウェア」',
        en: 'Scarlet Sign "Bloody Magic Square"'
      }
    },
    5: {
      boss: convertEnemy("Sakuya"),
      spellCard: {
        ja: '空虚「インフレーションスクウェア」',
        en: 'Void "Inflation Square"'
      }
    },
    6: {
      boss: convertEnemy("Remilia"),
      spellCard: {
        ja: '紅蝙蝠「ヴァンピリッシュナイト」',
        en: 'Scarlet Bat "Vampirish Night"'
      }
    },
    7: {
      boss: convertEnemy("Sakuya"),
      spellCard: {
        ja: '銀符「パーフェクトメイド」',
        en: 'Silver Sign "Perfect Maid"	'
      }
    },
    8: {
      boss: convertEnemy("Remilia"),
      spellCard: {
        ja: '神鬼「レミリアストーカー」',
        en: 'God Devil "Remilia Stoker"'
      }
    }
  },
  8: {
    1: {
      boss: convertEnemy("Ran"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Yuyuko"),
      spellCard: {
        ja: '幽雅「死出の誘蛾灯」',
        en: 'Ghostly Elegance "Light Trap of Passing Away"'
      }
    },
    3: {
      boss: convertEnemy("Ran"),
      spellCard: {
        ja: '密符「御大師様の秘鍵」',
        en: 'Esoteric Sign "Odaishi-sama\'s Secret Key"'
      }
    },
    4: {
      boss: convertEnemy("Yuyuko"),
      spellCard: {
        ja: '蝶符「鳳蝶紋の死槍」',
        en: 'Butterfly Sign "Deadly Lance of the Swallowtail Butterfly Crest"'
      }
    },
    5: {
      boss: convertEnemy("Ran"),
      spellCard: {
        ja: '行符「八千万枚護摩」',
        en: 'Ascetic Sign "Eighty Million Goma Boards"'
      }
    },
    6: {
      boss: convertEnemy("Yuyuko"),
      spellCard: {
        ja: '死符「酔人の生、死の夢幻」',
        en: 'Death Sign "Life of Drunk, Dream of Death"'
      }
    },
    7: {
      boss: convertEnemy("Ran"),
      spellCard: {
        ja: '超人「飛翔役小角」',
        en: 'Superhuman "Soaring En no Ozunu"'
      }
    },
    8: {
      boss: convertEnemy("Yuyuko"),
      spellCard: {
        ja: '「死蝶浮月」',
        en: '"Death Butterfly, Floating Moon"'
      }
    }
  },
  9: {
    1: {
      boss: convertEnemy("Eirin"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Kaguya"),
      spellCard: {
        ja: '新難題「月のイルメナイト」',
        en: 'New Impossible Request "Lunar Ilmenite"'
      }
    },
    3: {
      boss: convertEnemy("Eirin"),
      spellCard: {
        ja: '薬符「胡蝶夢丸ナイトメア」',
        en: 'Medicine Sign "Butterfly Dream Pill - Nightmare Type"'
      }
    },
    4: {
      boss: convertEnemy("Kaguya"),
      spellCard: {
        ja: '新難題「エイジャの赤石」',
        en: 'New Impossible Request "Red Stone of Aja"'
      }
    },
    5: {
      boss: convertEnemy("Eirin"),
      spellCard: {
        ja: '錬丹「水銀の海」',
        en: 'Elixir "Quicksilver Sea"'
      }
    },
    6: {
      boss: convertEnemy("Kaguya"),
      spellCard: {
        ja: '新難題「金閣寺の一枚天井」',
        en: 'New Impossible Request "Seamless Ceiling of Kinkaku-ji"'
      }
    },
    7: {
      boss: convertEnemy("Eirin"),
      spellCard: {
        ja: '秘薬「仙香玉兎」',
        en: 'Secret Elixir "Lunar Rabbit Incense"'
      }
    },
    8: {
      boss: convertEnemy("Kaguya"),
      spellCard: {
        ja: '新難題「ミステリウム」',
        en: 'New Impossible Request "Mysterium"'
      }
    }
  },
  10: {
    1: {
      boss: convertEnemy("Komachi"),
      spellCard: {
        ja: '通常弾幕',
        en: 'Non Spell'
      }
    },
    2: {
      boss: convertEnemy("Eiki"),
      spellCard: {
        ja: '嘘言「タン・オブ・ウルフ」',
        en: 'Lie "Tongue of Wolf"'
      }
    },
    3: {
      boss: convertEnemy("Komachi"),
      spellCard: {
        ja: '死歌「八重霧の渡し」',
        en: 'Death Song "Ferry of the Deep Fog"'
      }
    },
    4: {
      boss: convertEnemy("Eiki"),
      spellCard: {
        ja: '審判「十王裁判」',
        en: 'Judgement "Trial of the Ten Kings"'
      }
    },
    5: {
      boss: convertEnemy("Komachi"),
      spellCard: {
        ja: '古雨「黄泉中有の旅の雨」',
        en: 'Old Rain "Rain in the Liminal Journey Through Yomi"'
      }
    },
    6: {
      boss: convertEnemy("Eiki"),
      spellCard: {
        ja: '審判「ギルティ・オワ・ノットギルティ」',
        en: 'udgement "Guilty or Not Guilty"'
      }
    },
    7: {
      boss: convertEnemy("Komachi"),
      spellCard: {
        ja: '死価「プライス・オブ・ライフ」',
        en: 'Death Price "Price of Life"'
      }
    },
    8: {
      boss: convertEnemy("Eiki"),
      spellCard: {
        ja: '審判「浄頗梨審判 -射命丸文-」',
        en: 'Judgement "Cleansed Crystal Judgement -Aya Shameimaru-"'
      }
    }
  },
  EX: {
    1: {
      boss: convertEnemy("Flandre"),
      spellCard: {
        ja: '禁忌「フォービドゥンフルーツ」',
        en: 'Taboo "Forbidden Fruit"'
      }
    },
    2: {
      boss: convertEnemy("Flandre"),
      spellCard: {
        ja: '禁忌「禁じられた遊び」',
        en: 'Taboo "Forbidden Games"'
      }
    },
    3: {
      boss: convertEnemy("Yukari"),
      spellCard: {
        ja: '境符「色と空の境界」',
        en: 'Border Sign "Boundary of Form and Emptiness"'
      }
    },
    4: {
      boss: convertEnemy("Yukari"),
      spellCard: {
        ja: '境符「波と粒の境界」',
        en: 'Border Sign "Boundary of Wave and Particle"'
      }
    },
    5: {
      boss: convertEnemy("Mokou"),
      spellCard: {
        ja: '貴人「サンジェルマンの忠告」',
        en: 'Exalted Personage "Forewarning of St. Germain"	'
      }
    },
    6: {
      boss: convertEnemy("Mokou"),
      spellCard: {
        ja: '蓬莱「瑞江浦嶋子と五色の瑞亀」',
        en: 'Hourai "Mizunoe no Uranoshimako and the Five-Colored Turtle"'
      }
    },
    7: {
      boss: convertEnemy("Suica"),
      spellCard: {
        ja: '鬼気「濛々迷霧」',
        en: 'Ghastly Air "Deep Fog Labyrinth"'
      }
    },
    8: {
      boss: convertEnemy("Suica"),
      spellCard: {
        ja: '「百万鬼夜行」',
        en: '"Night Parade of a Million Demons"'
      }
    }
  }
}

function convertSpellCard(level: string, scene: string){
  return spellCardMap[level][scene] || {spellCard: {ja: 'Unknown'}, boss: {ja: 'Unknown', en: 'Unknwon'}}
}

interface Th95Replay{
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
    stage_details: []
  }
}

export function Th95Table(replay: Th95Replay){

  let difficultyColor='white'
  if (String(replay.replay_meta.level)==='EX'){
    difficultyColor=useTableUtils().convertDifficulty('3').color
  }
  else if(Number(replay.replay_meta.level)<=3){
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
      theme_color: '#009973',
      img: {
        thumb: '/images/thumb/th95.png',
        full: '/images/full/th95.png',
        alt: 'th95'
      },
      name: '東方文花帖 〜 Shoot the Bullet.'
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
    replay_id: replay.replay_id,
    stage_details:{
      headers: [],
      items: []
    }
  }
}