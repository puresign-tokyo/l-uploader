<script setup lang="ts">

  const enemyMap={
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

  type EnemyId = keyof typeof enemyMap

  export function th95EnemyName(enemyId: string){
    if (!Object.prototype.hasOwnProperty.call(enemyMap, enemyId)) {
      throw new Error(`不正な敵ID: ${enemyId}`);
    }
    const enemyName = enemyMap[enemyId as EnemyId]
  }

  export function th95SpellCardInfo(level: string, scene: number){
    const spellInfoMap = {
      1: {
        1: {
          enemy: th95EnemyName("Wriggle"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Rumia"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        3: {
          enemy: th95EnemyName("Wriggle"),
          spellCardName: {
            ja: '蛍符「地上の恒星」',
            en: 'Firefly Sign "Fixed Stars on Earth"'
          }
        },
        4: {
          enemy: th95EnemyName("Rumia"),
          spellCardName: {
            ja: '闇符「ダークサイドオブザムーン」',
            en: 'Darkness Sign "Dark Side of the Moon"'
          }
        },
        5: {
          enemy: th95EnemyName("Wriggle"),
          spellCardName: {
            ja: '蝶符「バタフライストーム」',
            en: 'Butterfly Sign "Butterfly Storm"'
          }
        },
        6: {
          enemy: th95EnemyName("Rumia"),
          spellCardName: {
            ja: '夜符「ミッドナイトバード」',
            en: 'Night Sign "Midnight Bird"'
          }
        }
    },
    2: {
        1: {
          enemy: th95EnemyName("Cirno"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Letty"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        3: {
          enemy: th95EnemyName("Cirno"),
          spellCardName: {
            ja: '雪符「ダイアモンドブリザード」',
            en: 'Snow Sign "Diamond Blizzard"	'
          }
        },
        4: {
          enemy: th95EnemyName("Letty"),
          spellCardName: {
            ja: '寒符「コールドスナップ」',
            en: 'Cold Sign "Cold Snap"'
          }
        },
        5: {
          enemy: th95EnemyName("Cirno"),
          spellCardName: {
            ja: '凍符「マイナスＫ」',
            en: 'Freeze Sign "Minus K"'
          }
        },
        6: {
          enemy: th95EnemyName("Letty"),
          spellCardName: {
            ja: '冬符「ノーザンウイナー」',
            en: 'Winter Sign "Northern Winner"'
          }
        }
      },
      3: {
        1: {
          enemy: th95EnemyName("Alice"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Keine"),
          spellCardName: {
            ja: '3-2 光符「アマテラス」',
            en: 'Light Sign "Amaterasu"'
          }
        },
        3: {
          enemy: th95EnemyName("Alice"),
          spellCardName: {
            ja: '操符「ドールズインシー」',
            en: 'Puppeteer Sign "Dolls in Sea"'
          }
        },
        4: {
          enemy: th95EnemyName("Keine"),
          spellCardName: {
            ja: '包符「昭和の雨」',
            en: 'Shroud Sign "Rain of Showa"'
          }
        },
        5: {
          enemy: th95EnemyName("Alice"),
          spellCardName: {
            ja: '呪符「ストロードールカミカゼ」',
            en: 'Curse Sign "Straw Doll Kamikaze"'
          }
        },
        6: {
          enemy: th95EnemyName("Keine"),
          spellCardName: {
            ja: '葵符「水戸の光圀」',
            en: 'Hollyhock Sign "Mito no Mitsukuni"'
          }
        },
        7: {
          enemy: th95EnemyName("Alice"),
          spellCardName: {
            ja: '赤符「ドールミラセティ」',
            en: 'Red Sign "Doll Mira Ceti"'
          }
        },
        8: {
          enemy: th95EnemyName("Keine"),
          spellCardName: {
            ja: '倭符「邪馬台の国」',
            en: 'Japan Sign "Yamato Kingdom"'
          }
        }
      },
      4: {
        1: {
          enemy: th95EnemyName("Reisen"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Medicine"),
          spellCardName: {
            ja: '霧符「ガシングガーデン」',
            en: 'Fog Sign "Gassing Garden"'
          }
        },
        3: {
          enemy: th95EnemyName("Tewi"),
          spellCardName: {
            ja: '脱兎「フラスターエスケープ」',
            en: 'Runaway Rabbit "Fluster Escape"'
          }
        },
        4: {
          enemy: th95EnemyName("Reisen"),
          spellCardName: {
            ja: '散符「朧月花栞（ロケット・イン・ミスト）」',
            en: 'Spread Sign "Hazy Moon Flower Bookmark (Rocket in Mist)'
          }
        },
        5: {
          enemy: th95EnemyName("Medicine"),
          spellCardName: {
            ja: '毒符「ポイズンブレス」',
            en: 'Poison Sign "Poison Breath"'
          }
        },
        6: {
          enemy: th95EnemyName("Reisen"),
          spellCardName: {
            ja: '波符「幻の月（インビジブルハーフムーン）」',
            en: 'Wave Sign "Moon of Illusion (Invisible Half-Moon)"'
          }
        },
        7: {
          enemy: th95EnemyName("Medicine"),
          spellCardName: {
            ja: '譫妄「イントゥデリリウム」',
            en: 'Confusion "Into Delirium"'
          }
        },
        8: {
          enemy: th95EnemyName("Tewi"),
          spellCardName: {
            ja: '借符「大穴牟遅様の薬」',
            en: 'Owing Sign "Vulnerary of Ohnamuji-sama"'
          }
        },
        9: {
          enemy: th95EnemyName("Reisen"),
          spellCardName: {
            ja: '狂夢「風狂の夢（ドリームワールド）」',
            en: 'Mad Dream "Drean of Insanity (Dream World)"'
          }
        }
      },
      5: {
        1: {
          enemy: th95EnemyName("Meiling"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Patchouli"),
          spellCardName: {
            ja: '日＆水符「ハイドロジェナスプロミネンス」',
            en: 'Sun & Water Sign "Hydrogenous Prominence"'
          }
        },
        3: {
          enemy: th95EnemyName("Meiling"),
          spellCardName: {
            ja: '華符「彩光蓮華掌」',
            en: 'Flower Sign "Colorful Light Lotus Flower Palm"'
          }
        },
        4: {
          enemy: th95EnemyName("Patchouli"),
          spellCardName: {
            ja: '水＆火符「フロギスティックレイン」',
            en: 'Water Fire Sign "Phlogistic Rain"'
          }
        },
        5: {
          enemy: th95EnemyName("Meiling"),
          spellCardName: {
            ja: '彩翔「飛花落葉」',
            en: 'Colorful Flip "Fluttering Petals and Falling Leaves"'
          }
        },
        6: {
          enemy: th95EnemyName("Patchouli"),
          spellCardName: {
            ja: '月＆木符「サテライトヒマワリ」',
            en: 'Moon Wood Sign "Satellite Himawari"'
          }
        },
        7: {
          enemy: th95EnemyName("Meiling"),
          spellCardName: {
            ja: '彩華「虹色太極拳」',
            en: 'Colorful Chinese Flower "Rainbow Taijiquan"'
          }
        },
        8: {
          enemy: th95EnemyName("Patchouli"),
          spellCardName: {
            ja: '日＆月符「ロイヤルダイアモンドリング」',
            en: 'Sun Moon Sign "Royal Diamond Ring"'
          }
        }
      },
      6: {
        1: {
          enemy: th95EnemyName("Chen"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Youmu"),
          spellCardName: {
            ja: '人智剣「天女返し」',
            en: 'Human Knowledge Sword "Turning Angel Cut"'
          }
        },
        3: {
          enemy: th95EnemyName("Chen"),
          spellCardName: {
            ja: '星符「飛び重ね鱗」',
            en: 'Star Sign "Leaping Kasane-Uroko Star"'
          }
        },
        4: {
          enemy: th95EnemyName("Youmu"),
          spellCardName: {
            ja: '妄執剣「修羅の血」',
            en: 'Obsession Sword "Blood of Asura"'
          }
        },
        5: {
          enemy: th95EnemyName("Chen"),
          spellCardName: {
            ja: '鬼神「鳴動持国天」',
            en: 'Kishin "Rumbling Jikokuten"'
          }
        },
        6: {
          enemy: th95EnemyName("Youmu"),
          spellCardName: {
            ja: '天星剣「涅槃寂静の如し」',
            en: 'Celestial Star Sword "As the Silent Nirvana"'
          }
        },
        7: {
          enemy: th95EnemyName("Chen"),
          spellCardName: {
            ja: '化猫「橙」',
            en: 'Bakeneko "Chen"'
          }
        },
        8: {
          enemy: th95EnemyName("四生剣「衆生無情の響き」"),
          spellCardName: {
            ja: '四生剣「衆生無情の響き」',
            en: 'Four Births Sword "Echoes of the Inclemency of All Beings"'
          }
        },
      },
      7: {
        1: {
          enemy: th95EnemyName("Sakuya"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Remilia"),
          spellCardName: {
            ja: '魔符「全世界ナイトメア」',
            en: 'Devil Sign "All the World in Nightmare"'
          }
        },
        3: {
          enemy: th95EnemyName("Sakuya"),
          spellCardName: {
            ja: '時符「トンネルエフェクト」',
            en: 'Time Sign "Tunnel Effect"'
          }
        },
        4: {
          enemy: th95EnemyName("Remilia"),
          spellCardName: {
            ja: '紅符「ブラッディマジックスクウェア」',
            en: 'Scarlet Sign "Bloody Magic Square"'
          }
        },
        5: {
          enemy: th95EnemyName("Sakuya"),
          spellCardName: {
            ja: '空虚「インフレーションスクウェア」',
            en: 'Void "Inflation Square"'
          }
        },
        6: {
          enemy: th95EnemyName("Remilia"),
          spellCardName: {
            ja: '紅蝙蝠「ヴァンピリッシュナイト」',
            en: 'Scarlet Bat "Vampirish Night"'
          }
        },
        7: {
          enemy: th95EnemyName("Sakuya"),
          spellCardName: {
            ja: '銀符「パーフェクトメイド」',
            en: 'Silver Sign "Perfect Maid"	'
          }
        },
        8: {
          enemy: th95EnemyName("Remilia"),
          spellCardName: {
            ja: '神鬼「レミリアストーカー」',
            en: 'God Devil "Remilia Stoker"'
          }
        }
      },
      8: {
        1: {
          enemy: th95EnemyName("Ran"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Yuyuko"),
          spellCardName: {
            ja: '幽雅「死出の誘蛾灯」',
            en: 'Ghostly Elegance "Light Trap of Passing Away"'
          }
        },
        3: {
          enemy: th95EnemyName("Ran"),
          spellCardName: {
            ja: '密符「御大師様の秘鍵」',
            en: 'Esoteric Sign "Odaishi-sama\'s Secret Key"'
          }
        },
        4: {
          enemy: th95EnemyName("Yuyuko"),
          spellCardName: {
            ja: '蝶符「鳳蝶紋の死槍」',
            en: 'Butterfly Sign "Deadly Lance of the Swallowtail Butterfly Crest"'
          }
        },
        5: {
          enemy: th95EnemyName("Ran"),
          spellCardName: {
            ja: '行符「八千万枚護摩」',
            en: 'Ascetic Sign "Eighty Million Goma Boards"'
          }
        },
        6: {
          enemy: th95EnemyName("Yuyuko"),
          spellCardName: {
            ja: '死符「酔人の生、死の夢幻」',
            en: 'Death Sign "Life of Drunk, Dream of Death"'
          }
        },
        7: {
          enemy: th95EnemyName("Ran"),
          spellCardName: {
            ja: '超人「飛翔役小角」',
            en: 'Superhuman "Soaring En no Ozunu"'
          }
        },
        8: {
          enemy: th95EnemyName("Yuyuko"),
          spellCardName: {
            ja: '「死蝶浮月」',
            en: '"Death Butterfly, Floating Moon"'
          }
        }
      },
      9: {
        1: {
          enemy: th95EnemyName("Eirin"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Kaguya"),
          spellCardName: {
            ja: '新難題「月のイルメナイト」',
            en: 'New Impossible Request "Lunar Ilmenite"'
          }
        },
        3: {
          enemy: th95EnemyName("Eirin"),
          spellCardName: {
            ja: '薬符「胡蝶夢丸ナイトメア」',
            en: 'Medicine Sign "Butterfly Dream Pill - Nightmare Type"'
          }
        },
        4: {
          enemy: th95EnemyName("Kaguya"),
          spellCardName: {
            ja: '新難題「エイジャの赤石」',
            en: 'New Impossible Request "Red Stone of Aja"'
          }
        },
        5: {
          enemy: th95EnemyName("Eirin"),
          spellCardName: {
            ja: '錬丹「水銀の海」',
            en: 'Elixir "Quicksilver Sea"'
          }
        },
        6: {
          enemy: th95EnemyName("Kaguya"),
          spellCardName: {
            ja: '新難題「金閣寺の一枚天井」',
            en: 'New Impossible Request "Seamless Ceiling of Kinkaku-ji"'
          }
        },
        7: {
          enemy: th95EnemyName("Eirin"),
          spellCardName: {
            ja: '秘薬「仙香玉兎」',
            en: 'Secret Elixir "Lunar Rabbit Incense"'
          }
        },
        8: {
          enemy: th95EnemyName("Kaguya"),
          spellCardName: {
            ja: '新難題「ミステリウム」',
            en: 'New Impossible Request "Mysterium"'
          }
        }
      },
      10: {
        1: {
          enemy: th95EnemyName("Komachi"),
          spellCardName: {
            ja: '通常弾幕',
            en: 'Non Spell'
          }
        },
        2: {
          enemy: th95EnemyName("Eiki"),
          spellCardName: {
            ja: '嘘言「タン・オブ・ウルフ」',
            en: 'Lie "Tongue of Wolf"'
          }
        },
        3: {
          enemy: th95EnemyName("Komachi"),
          spellCardName: {
            ja: '死歌「八重霧の渡し」',
            en: 'Death Song "Ferry of the Deep Fog"'
          }
        },
        4: {
          enemy: th95EnemyName("Eiki"),
          spellCardName: {
            ja: '審判「十王裁判」',
            en: 'Judgement "Trial of the Ten Kings"'
          }
        },
        5: {
          enemy: th95EnemyName("Komachi"),
          spellCardName: {
            ja: '古雨「黄泉中有の旅の雨」',
            en: 'Old Rain "Rain in the Liminal Journey Through Yomi"'
          }
        },
        6: {
          enemy: th95EnemyName("Eiki"),
          spellCardName: {
            ja: '審判「ギルティ・オワ・ノットギルティ」',
            en: 'udgement "Guilty or Not Guilty"'
          }
        },
        7: {
          enemy: th95EnemyName("Komachi"),
          spellCardName: {
            ja: '死価「プライス・オブ・ライフ」',
            en: 'Death Price "Price of Life"'
          }
        },
        8: {
          enemy: th95EnemyName("Eiki"),
          spellCardName: {
            ja: '審判「浄頗梨審判 -射命丸文-」',
            en: 'Judgement "Cleansed Crystal Judgement -Aya Shameimaru-"'
          }
        }
      },
      EX: {
        1: {
          enemy: th95EnemyName("Flandre"),
          spellCardName: {
            ja: '禁忌「フォービドゥンフルーツ」',
            en: 'Taboo "Forbidden Fruit"'
          }
        },
        2: {
          enemy: th95EnemyName("Flandre"),
          spellCardName: {
            ja: '禁忌「禁じられた遊び」',
            en: 'Taboo "Forbidden Games"'
          }
        },
        3: {
          enemy: th95EnemyName("Yukari"),
          spellCardName: {
            ja: '境符「色と空の境界」',
            en: 'Border Sign "Boundary of Form and Emptiness"'
          }
        },
        4: {
          enemy: th95EnemyName("Yukari"),
          spellCardName: {
            ja: '境符「波と粒の境界」',
            en: 'Border Sign "Boundary of Wave and Particle"'
          }
        },
        5: {
          enemy: th95EnemyName("Mokou"),
          spellCardName: {
            ja: '貴人「サンジェルマンの忠告」',
            en: 'Exalted Personage "Forewarning of St. Germain"	'
          }
        },
        6: {
          enemy: th95EnemyName("Mokou"),
          spellCardName: {
            ja: '蓬莱「瑞江浦嶋子と五色の瑞亀」',
            en: 'Hourai "Mizunoe no Uranoshimako and the Five-Colored Turtle"'
          }
        },
        7: {
          enemy: th95EnemyName("Suica"),
          spellCardName: {
            ja: '鬼気「濛々迷霧」',
            en: 'Ghastly Air "Deep Fog Labyrinth"'
          }
        },
        8: {
          enemy: th95EnemyName("Suica"),
          spellCardName: {
            ja: '「百万鬼夜行」',
            en: '"Night Parade of a Million Demons"'
          }
        }
      }
    }
    
  }
</script>