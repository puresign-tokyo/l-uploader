import { stringifyQuery } from "vue-router";
import { useTableUtils } from "./TableUtils";
import Replay_id from "~/pages/replays/[replay_id].vue";
import { compile } from "vue";

const spellCardMap: Record<string, { ja: string; en: string }> = {
  1: { ja: "蛍符「地上の流星」", en: 'Firefly Sign "Earthly Meteor"' },
  2: { ja: "蛍符「地上の彗星」", en: 'Firefly Sign "Earthly Comet"' },
  3: {
    ja: "灯符「ファイヤフライフェノメノン」",
    en: 'Lamp Sign "Firefly Phenomenon"',
  },
  4: {
    ja: "灯符「ファイヤフライフェノメノン」",
    en: 'Lamp Sign "Firefly Phenomenon"',
  },
  5: {
    ja: "灯符「ファイヤフライフェノメノン」",
    en: 'Lamp Sign "Firefly Phenomenon"',
  },
  6: {
    ja: "灯符「ファイヤフライフェノメノン」",
    en: 'Lamp Sign "Firefly Phenomenon"',
  },
  7: { ja: "蠢符「リトルバグ」", en: 'Wriggle Sign "Little Bug"' },
  8: {
    ja: "蠢符「リトルバグストーム」",
    en: 'Wriggle Sign "Little Bug Storm"',
  },
  9: { ja: "蠢符「ナイトバグストーム」", en: 'Wriggle Sign "Nightbug Storm"' },
  10: {
    ja: "蠢符「ナイトバグトルネード」",
    en: 'Wriggle Sign "Nightbug Tornado"',
  },
  11: { ja: "隠蟲「永夜蟄居」", en: 'Hidden Bug "Endless Night Seclusion"' },
  12: { ja: "隠蟲「永夜蟄居」", en: 'Hidden Bug "Endless Night Seclusion"' },
  13: { ja: "隠蟲「永夜蟄居」", en: 'Hidden Bug "Endless Night Seclusion"' },
  14: { ja: "声符「梟の夜鳴声」", en: 'Vocal Sign "Hooting in the Night"' },
  15: { ja: "声符「梟の夜鳴声」", en: 'Vocal Sign "Hooting in the Night"' },
  16: { ja: "声符「木菟咆哮」", en: 'Vocal Sign "Howl of the Horned Owl"' },
  17: { ja: "声符「木菟咆哮」", en: 'Vocal Sign "Howl of the Horned Owl"' },
  18: { ja: "蛾符「天蛾の蠱道」", en: 'Moth Sign "Hawk Moth\'s Insect Curse"' },
  19: { ja: "蛾符「天蛾の蠱道」", en: 'Moth Sign "Hawk Moth\'s Insect Curse"' },
  20: { ja: "毒符「毒蛾の鱗粉」", en: 'Toxin Sign "Poisonous Moth\'s Scales"' },
  21: {
    ja: "猛毒「毒蛾の暗闇演舞」",
    en: 'Deadly Toxin "Poisonous Moth\'s Dance in the Dark"',
  },
  22: { ja: "鷹符「イルスタードダイブ」", en: 'Hawk Sign "Ill-Starred Dive"' },
  23: { ja: "鷹符「イルスタードダイブ」", en: 'Hawk Sign "Ill-Starred Dive"' },
  24: { ja: "鷹符「イルスタードダイブ」", en: 'Hawk Sign "Ill-Starred Dive"' },
  25: { ja: "鷹符「イルスタードダイブ」", en: 'Hawk Sign "Ill-Starred Dive"' },
  26: {
    ja: "夜盲「夜雀の歌」",
    en: 'Night-Blindness "Song of the Night Sparrow"',
  },
  27: {
    ja: "夜盲「夜雀の歌」",
    en: 'Night-Blindness "Song of the Night Sparrow"',
  },
  28: {
    ja: "夜盲「夜雀の歌」",
    en: 'Night-Blindness "Song of the Night Sparrow"',
  },
  29: {
    ja: "夜盲「夜雀の歌」",
    en: 'Night-Blindness "Song of the Night Sparrow"',
  },
  30: {
    ja: "夜雀「真夜中のコーラスマスター」",
    en: 'Night-Sparrow "Midnight Chorus-Master"',
  },
  31: {
    ja: "夜雀「真夜中のコーラスマスター」",
    en: 'Night-Sparrow "Midnight Chorus-Master"',
  },
  32: {
    ja: "夜雀「真夜中のコーラスマスター」",
    en: 'Night-Sparrow "Midnight Chorus-Master"',
  },
  33: {
    ja: "産霊「ファーストピラミッド」",
    en: 'Spiritual Birth "First Pyramid"',
  },
  34: {
    ja: "産霊「ファーストピラミッド」",
    en: 'Spiritual Birth "First Pyramid"',
  },
  35: {
    ja: "産霊「ファーストピラミッド」",
    en: 'Spiritual Birth "First Pyramid"',
  },
  36: {
    ja: "産霊「ファーストピラミッド」",
    en: 'Spiritual Birth "First Pyramid"',
  },
  37: {
    ja: "始符「エフェメラリティ137」",
    en: 'Origin Sign "Ephemerality 137"',
  },
  38: {
    ja: "始符「エフェメラリティ137」",
    en: 'Origin Sign "Ephemerality 137"',
  },
  39: {
    ja: "始符「エフェメラリティ137」",
    en: 'Origin Sign "Ephemerality 137"',
  },
  40: { ja: "野符「武烈クライシス」", en: 'Ambition Sign "Buretsu Crisis"' },
  41: { ja: "野符「将門クライシス」", en: 'Ambition Sign "Masakado Crisis"' },
  42: { ja: "野符「義満クライシス」", en: 'Ambition Sign "Yoshimitsu Crisis"' },
  43: {
    ja: "野符「GHQクライシス」",
    en: 'Ambition Sign "General Headquarters Crisis"',
  },
  44: {
    ja: "国符「三種の神器　剣」",
    en: 'Land Sign "Three Sacred Treasures - Sword"',
  },
  45: {
    ja: "国符「三種の神器　玉」",
    en: 'Land Sign "Three Sacred Treasures - Orb"',
  },
  46: {
    ja: "国符「三種の神器　鏡」",
    en: 'Land Sign "Three Sacred Treasures - Mirror"',
  },
  47: {
    ja: "国体「三種の神器　郷」",
    en: 'Land Scheme "Three Sacred Treasures - Country"',
  },
  48: { ja: "終符「幻想天皇」", en: 'Ending Sign "Phantasmal Emperor"' },
  49: { ja: "終符「幻想天皇」", en: 'Ending Sign "Phantasmal Emperor"' },
  50: {
    ja: "虚史「幻想郷伝説」",
    en: 'Pseudo-History "The Legend of Gensokyo"',
  },
  51: {
    ja: "虚史「幻想郷伝説」",
    en: 'Pseudo-History "The Legend of Gensokyo"',
  },
  52: { ja: "未来「高天原」", en: 'Future "Gods\' Realm"' },
  53: { ja: "未来「高天原」", en: 'Future "Gods\' Realm"' },
  54: { ja: "未来「高天原」", en: 'Future "Gods\' Realm"' },
  55: { ja: "夢符「二重結界」", en: 'Dream Sign "Duplex Barrier"' },
  56: { ja: "夢符「二重結界」", en: 'Dream Sign "Duplex Barrier"' },
  57: { ja: "夢境「二重大結界」", en: 'Dream Land "Great Duplex Barrier"' },
  58: { ja: "夢境「二重大結界」", en: 'Dream Land "Great Duplex Barrier"' },
  59: { ja: "霊符「夢想封印　散」", en: 'Spirit Sign "Fantasy Seal -Spread-"' },
  60: { ja: "霊符「夢想封印　散」", en: 'Spirit Sign "Fantasy Seal -Spread-"' },
  61: {
    ja: "散霊「夢想封印　寂」",
    en: 'Scattered Spirit "Fantasy Seal -Worn-"',
  },
  62: {
    ja: "散霊「夢想封印　寂」",
    en: 'Scattered Spirit "Fantasy Seal -Worn-"',
  },
  63: { ja: "夢符「封魔陣」", en: 'Dream Sign "Evil-Sealing Circle"' },
  64: { ja: "夢符「封魔陣」", en: 'Dream Sign "Evil-Sealing Circle"' },
  65: {
    ja: "神技「八方鬼縛陣」",
    en: 'Divine Arts "Omnidirectional Oni-Binding Circle"',
  },
  66: {
    ja: "神技「八方龍殺陣」",
    en: 'Divine Arts "Omnidirectional Oni-Binding Circle"',
  },
  67: {
    ja: "霊符「夢想封印　集」",
    en: 'Spirit Sign "Fantasy Seal -Concentrate-"',
  },
  68: {
    ja: "霊符「夢想封印　集」",
    en: 'Spirit Sign "Fantasy Seal -Concentrate-"',
  },
  69: {
    ja: "回霊「夢想封印　侘」",
    en: 'Migrating Spirit "Fantasy Seal -Marred-"',
  },
  70: {
    ja: "回霊「夢想封印　侘」",
    en: 'Migrating Spirit "Fantasy Seal -Marred-"',
  },
  71: { ja: "境界「二重弾幕結界」", en: 'Boundary "Duplex Danmaku Barrier"' },
  72: { ja: "境界「二重弾幕結界」", en: 'Boundary "Duplex Danmaku Barrier"' },
  73: {
    ja: "大結界「博麗弾幕結界」",
    en: 'Great Barrier "Hakurei Danmaku Barrier"',
  },
  74: {
    ja: "大結界「博麗弾幕結界」",
    en: 'Great Barrier "Hakurei Danmaku Barrier"',
  },
  75: {
    ja: "神霊「夢想封印　瞬」",
    en: 'Divine Spirit "Fantasy Seal -Blink-"',
  },
  76: {
    ja: "神霊「夢想封印　瞬」",
    en: 'Divine Spirit "Fantasy Seal -Blink-"',
  },
  77: {
    ja: "神霊「夢想封印　瞬」",
    en: 'Divine Spirit "Fantasy Seal -Blink-"',
  },
  78: { ja: "魔符「ミルキーウェイ」", en: 'Magic Sign "Milky Way"' },
  79: { ja: "魔符「ミルキーウェイ」", en: 'Magic Sign "Milky Way"' },
  80: { ja: "魔空「アステロイドベルト」", en: 'Magic Space "Asteroid Belt"' },
  81: { ja: "魔空「アステロイドベルト」", en: 'Magic Space "Asteroid Belt"' },
  82: {
    ja: "魔符「スターダストレヴァリエ」",
    en: 'Magic Sign "Stardust Reverie"',
  },
  83: {
    ja: "魔符「スターダストレヴァリエ」",
    en: 'Magic Sign "Stardust Reverie"',
  },
  84: { ja: "黒魔「イベントホライズン」", en: 'Black Magic "Event Horizon"' },
  85: { ja: "黒魔「イベントホライズン」", en: 'Black Magic "Event Horizon"' },
  86: {
    ja: "恋符「ノンディレクショナルレーザー」",
    en: 'Love Sign "Non-Directional Laser"',
  },
  87: {
    ja: "恋符「ノンディレクショナルレーザー」",
    en: 'Love Sign "Non-Directional Laser"',
  },
  88: {
    ja: "恋風「スターライトタイフーン」",
    en: 'Love Storm "Starlight Typhoon"',
  },
  89: {
    ja: "恋風「スターライトタイフーン」",
    en: 'Love Storm "Starlight Typhoon"',
  },
  90: { ja: "恋符「マスタースパーク」", en: 'Love Sign "Master Spark"' },
  91: { ja: "恋符「マスタースパーク」", en: 'Love Sign "Master Spark"' },
  92: { ja: "恋心「ダブルスパーク」", en: 'Loving Heart "Double Spark"' },
  93: { ja: "恋心「ダブルスパーク」", en: 'Loving Heart "Double Spark"' },
  94: { ja: "光符「アースライトレイ」", en: 'Light Sign "Earthlight Ray"' },
  95: { ja: "光符「アースライトレイ」", en: 'Light Sign "Earthlight Ray"' },
  96: {
    ja: "光撃「シュート・ザ・ムーン」",
    en: 'Light Blast "Shoot the Moon"',
  },
  97: {
    ja: "光撃「シュート・ザ・ムーン」",
    en: 'Light Blast "Shoot the Moon"',
  },
  98: { ja: "魔砲「ファイナルスパーク」", en: 'Magicannon "Final Spark"' },
  99: { ja: "魔砲「ファイナルスパーク」", en: 'Magicannon "Final Spark"' },
  100: {
    ja: "魔砲「ファイナルマスタースパーク」",
    en: 'Magicannon "Final Master Spark"',
  },
  101: {
    ja: "波符「赤眼催眠(マインドシェイカー)」",
    en: 'Wave Sign "Red-Eyed Hypnosis (Mind Shaker)"',
  },
  102: {
    ja: "波符「赤眼催眠(マインドシェイカー)」",
    en: 'Wave Sign "Red-Eyed Hypnosis (Mind Shaker)"',
  },
  103: {
    ja: "幻波「赤眼催眠(マインドブローイング)」",
    en: 'Illusion Wave "Red-Eyed Hypnosis (Mind Blowing)"',
  },
  104: {
    ja: "幻波「赤眼催眠(マインドブローイング)」",
    en: 'Illusion Wave "Red-Eyed Hypnosis (Mind Blowing)"',
  },
  105: {
    ja: "狂符「幻視調律(ビジョナリチューニング)」",
    en: 'Lunatic Sign "Hallucinogenic Tuning (Visionary Tuning)"',
  },
  106: {
    ja: "狂符「幻視調律(ビジョナリチューニング)」",
    en: 'Lunatic Sign "Hallucinogenic Tuning (Visionary Tuning)"',
  },
  107: {
    ja: "狂視「狂視調律(イリュージョンシーカー)」",
    en: 'Lunatic Gaze "Lunatic Stare Tuning (Illusion Seeker)"',
  },
  108: {
    ja: "狂視「狂視調律(イリュージョンシーカー)」",
    en: 'Lunatic Gaze "Lunatic Stare Tuning (Illusion Seeker)"',
  },
  109: {
    ja: "懶符「生神停止(アイドリングウェーブ)」",
    en: 'Loafing Sign "Life & Spirit Stopping (Idling Wave)"',
  },
  110: {
    ja: "懶符「生神停止(アイドリングウェーブ)」",
    en: 'Loafing Sign "Life & Spirit Stopping (Idling Wave)"',
  },
  111: {
    ja: "懶惰「生神停止(マインドストッパー)」",
    en: 'Indolence "Life & Spirit Stopping (Mind Stopper)"',
  },
  112: {
    ja: "懶惰「生神停止(マインドストッパー)」",
    en: 'Indolence "Life & Spirit Stopping (Mind Stopper)"',
  },
  113: {
    ja: "散符「真実の月(インビジブルフルムーン)」",
    en: 'Spread Sign "Moon of Truth (Invisible Full Moon)"',
  },
  114: {
    ja: "散符「真実の月(インビジブルフルムーン)」",
    en: 'Spread Sign "Moon of Truth (Invisible Full Moon)"',
  },
  115: {
    ja: "散符「真実の月(インビジブルフルムーン)」",
    en: 'Spread Sign "Moon of Truth (Invisible Full Moon)"',
  },
  116: {
    ja: "散符「真実の月(インビジブルフルムーン)」",
    en: 'Spread Sign "Moon of Truth (Invisible Full Moon)"',
  },
  117: {
    ja: "月眼「月兎遠隔催眠術(テレメスメリズム)」",
    en: 'Lunar Eyes "Lunar Rabbit\'s Remote Mesmerism (Tele-Mesmerism)"',
  },
  118: {
    ja: "月眼「月兎遠隔催眠術(テレメスメリズム)」",
    en: 'Lunar Eyes "Lunar Rabbit\'s Remote Mesmerism (Tele-Mesmerism)"',
  },
  119: {
    ja: "月眼「月兎遠隔催眠術(テレメスメリズム)」",
    en: 'Lunar Eyes "Lunar Rabbit\'s Remote Mesmerism (Tele-Mesmerism)"',
  },
  120: { ja: "天丸「壺中の天地」", en: 'Spacesphere "Earth in a Pot"' },
  121: { ja: "天丸「壺中の天地」", en: 'Spacesphere "Earth in a Pot"' },
  122: { ja: "天丸「壺中の天地」", en: 'Spacesphere "Earth in a Pot"' },
  123: { ja: "天丸「壺中の天地」", en: 'Spacesphere "Earth in a Pot"' },
  124: {
    ja: "覚神「神代の記憶」",
    en: 'Awakened God "Memories of the Age of the Gods"',
  },
  125: {
    ja: "覚神「神代の記憶」",
    en: 'Awakened God "Memories of the Age of the Gods"',
  },
  126: {
    ja: "神符「天人の系譜」",
    en: 'God Sign "Genealogy of the Celestials"',
  },
  127: {
    ja: "神符「天人の系譜」",
    en: 'God Sign "Genealogy of the Celestials"',
  },
  128: {
    ja: "蘇活「生命遊戯　-ライフゲーム-」",
    en: 'Revival "Seimei Yūgi -Life Game-"',
  },
  129: {
    ja: "蘇活「生命遊戯　-ライフゲーム-」",
    en: 'Revival "Seimei Yūgi -Life Game-"',
  },
  130: { ja: "蘇生「ライジングゲーム」", en: 'Resurrection "Rising Game"' },
  131: { ja: "蘇生「ライジングゲーム」", en: 'Resurrection "Rising Game"' },
  132: {
    ja: "操神「オモイカネディバイス」",
    en: 'Leading God "Omoikane\'s Device"',
  },
  133: {
    ja: "操神「オモイカネディバイス」",
    en: 'Leading God "Omoikane\'s Device"',
  },
  134: {
    ja: "神脳「オモイカネブレイン」",
    en: 'Mind of God "Omoikane\'s Brain"',
  },
  135: {
    ja: "神脳「オモイカネブレイン」",
    en: 'Mind of God "Omoikane\'s Brain"',
  },
  136: { ja: "天呪「アポロ１３」", en: 'Curse of the Heavens "Apollo 13"' },
  137: { ja: "天呪「アポロ１３」", en: 'Curse of the Heavens "Apollo 13"' },
  138: { ja: "天呪「アポロ１３」", en: 'Curse of the Heavens "Apollo 13"' },
  139: { ja: "天呪「アポロ１３」", en: 'Curse of the Heavens "Apollo 13"' },
  140: { ja: "秘術「天文密葬法」", en: 'Esoterica "Astronomical Entombing"' },
  141: { ja: "秘術「天文密葬法」", en: 'Esoterica "Astronomical Entombing"' },
  142: { ja: "秘術「天文密葬法」", en: 'Esoterica "Astronomical Entombing"' },
  143: { ja: "秘術「天文密葬法」", en: 'Esoterica "Astronomical Entombing"' },
  144: { ja: "禁薬「蓬莱の薬」", en: 'Forbidden Elixir "Hourai Elixir"' },
  145: { ja: "禁薬「蓬莱の薬」", en: 'Forbidden Elixir "Hourai Elixir"' },
  146: { ja: "禁薬「蓬莱の薬」", en: 'Forbidden Elixir "Hourai Elixir"' },
  147: { ja: "禁薬「蓬莱の薬」", en: 'Forbidden Elixir "Hourai Elixir"' },
  148: { ja: "薬符「壺中の大銀河」", en: 'Medicine Sign "Galaxy in a Pot"' },
  149: { ja: "薬符「壺中の大銀河」", en: 'Medicine Sign "Galaxy in a Pot"' },
  150: { ja: "薬符「壺中の大銀河」", en: 'Medicine Sign "Galaxy in a Pot"' },
  151: { ja: "薬符「壺中の大銀河」", en: 'Medicine Sign "Galaxy in a Pot"' },
  152: {
    ja: "難題「龍の頸の玉 -五色の弾丸-」",
    en: "Impossible Request \"Dragon's Neck's Jewel -Five-Colored Shots-\"",
  },
  153: {
    ja: "難題「龍の頸の玉 -五色の弾丸-」",
    en: "Impossible Request \"Dragon's Neck's Jewel -Five-Colored Shots-\"",
  },
  154: {
    ja: "神宝「ブリリアントドラゴンバレッタ」",
    en: 'Divine Treasure "Brilliant Dragon Bullet"',
  },
  155: {
    ja: "神宝「ブリリアントドラゴンバレッタ」",
    en: 'Divine Treasure "Brilliant Dragon Bullet"',
  },
  156: {
    ja: "難題「仏の御石の鉢 -砕けぬ意思-」",
    en: 'Impossible Request "Buddha\'s Stone Bowl -Indomitable Will-"',
  },
  157: {
    ja: "難題「仏の御石の鉢 -砕けぬ意思-」",
    en: 'Impossible Request "Buddha\'s Stone Bowl -Indomitable Will-"',
  },
  158: {
    ja: "神宝「ブディストダイアモンド」",
    en: 'Divine Treasure "Buddhist Diamond"',
  },
  159: {
    ja: "神宝「ブディストダイアモンド」",
    en: 'Divine Treasure "Buddhist Diamond"',
  },
  160: {
    ja: "難題「火鼠の皮衣 -焦れぬ心-」",
    en: 'Impossible Request "Robe of Fire Rat -Patient Mind-"',
  },
  161: {
    ja: "難題「火鼠の皮衣 -焦れぬ心-」",
    en: 'Impossible Request "Robe of Fire Rat -Patient Mind-"',
  },
  162: {
    ja: "神宝「サラマンダーシールド」",
    en: 'Divine Treasure "Salamander Shield"',
  },
  163: {
    ja: "神宝「サラマンダーシールド」",
    en: 'Divine Treasure "Salamander Shield"',
  },
  164: {
    ja: "難題「燕の子安貝 -永命線-」",
    en: 'Impossible Request "Swallow\'s Cowrie Shell -Everlasting Life-"',
  },
  165: {
    ja: "難題「燕の子安貝 -永命線-」",
    en: 'Impossible Request "Swallow\'s Cowrie Shell -Everlasting Life-"',
  },
  166: {
    ja: "神宝「ライフスプリングインフィニティ」",
    en: 'Divine Treasure "Life Spring Infinity"',
  },
  167: {
    ja: "神宝「ライフスプリングインフィニティ」",
    en: 'Divine Treasure "Life Spring Infinity"',
  },
  168: {
    ja: "難題「蓬莱の弾の枝 -虹色の弾幕-」",
    en: 'Impossible Request "Bullet Branch of Hourai -Rainbow Danmaku-"',
  },
  169: {
    ja: "難題「蓬莱の弾の枝 -虹色の弾幕-」",
    en: 'Impossible Request "Bullet Branch of Hourai -Rainbow Danmaku-"',
  },
  170: {
    ja: "神宝「蓬莱の玉の枝 -夢色の郷-」",
    en: 'Divine Treasure "Jeweled Branch of Hourai -Dreamlike Paradise-"',
  },
  171: {
    ja: "神宝「蓬莱の玉の枝 -夢色の郷-」",
    en: 'Divine Treasure "Jeweled Branch of Hourai -Dreamlike Paradise-"',
  },
  172: {
    ja: "「永夜返し -初月-」",
    en: '"End of Imperishable Night -New Moon-"',
  },
  173: {
    ja: "「永夜返し -三日月-」",
    en: '"End of Imperishable Night -Crescent Moon-"',
  },
  174: {
    ja: "「永夜返し -上つ弓張-」",
    en: '"End of Imperishable Night -1st Quarter\'s Moon-"',
  },
  175: {
    ja: "「永夜返し -待宵-」",
    en: '"End of Imperishable Night -Matsuyoi-"',
  },
  176: {
    ja: "「永夜返し -子の刻-」",
    en: '"End of Imperishable Night -11 o\'Clock-"',
  },
  177: {
    ja: "「永夜返し -子の二つ-」",
    en: '"End of Imperishable Night -Half to Midnight-"',
  },
  178: {
    ja: "「永夜返し -子の三つ-」",
    en: '"End of Imperishable Night -Midnight-"',
  },
  179: {
    ja: "「永夜返し -子の四つ-」",
    en: '"End of Imperishable Night -Half Past Midnight-"',
  },
  180: {
    ja: "「永夜返し -丑の刻-」",
    en: '"End of Imperishable Night -1 o\'Clock-"',
  },
  181: {
    ja: "「永夜返し -丑の二つ-」",
    en: '"End of Imperishable Night -Half Past 1-"',
  },
  182: {
    ja: "「永夜返し -丑三つ時-」",
    en: '"End of Imperishable Night -Dead of Night-"',
  },
  183: {
    ja: "「永夜返し -丑の四つ-」",
    en: '"End of Imperishable Night -Half Past 2-"',
  },
  184: {
    ja: "「永夜返し -寅の刻-」",
    en: '"End of Imperishable Night -3 o\'Clock-"',
  },
  185: {
    ja: "「永夜返し -寅の二つ-」",
    en: '"End of Imperishable Night -Half Past 3-"',
  },
  186: {
    ja: "「永夜返し -寅の三つ-」",
    en: '"End of Imperishable Night -4 o\'Clock-"',
  },
  187: {
    ja: "「永夜返し -寅の四つ-」",
    en: '"End of Imperishable Night -Half Past 4-"',
  },
  188: {
    ja: "「永夜返し -朝靄-」",
    en: '"End of Imperishable Night -Morning Mist-"',
  },
  189: {
    ja: "「永夜返し -夜明け-」",
    en: '"End of Imperishable Night -Dawn-"',
  },
  190: {
    ja: "「永夜返し -明けの明星-」",
    en: '"End of Imperishable Night -Morning Star-"',
  },
  191: {
    ja: "「永夜返し -世明け-」",
    en: '"End of Imperishable Night -Rising World-"',
  },
  192: {
    ja: "旧史「旧秘境史　-オールドヒストリー-」",
    en: 'Past "Old History of an Untrodden Land -Old History-"',
  },
  193: {
    ja: "転世「一条戻り橋」",
    en: 'Reincarnation "Ichijou Returning Bridge"',
  },
  194: {
    ja: "新史「新幻想史　-ネクストヒストリー-」",
    en: 'Future "New History of Fantasy -Next History-"',
  },
  195: {
    ja: "時効「月のいはかさの呪い」",
    en: 'Limiting Edict "Curse of Tsuki-no-Iwakasa"',
  },
  196: {
    ja: "不死「火の鳥　-鳳翼天翔-」",
    en: 'Undying "Fire Bird -Feng Wing Ascension-"',
  },
  197: { ja: "藤原「滅罪寺院傷」", en: 'Fujiwara "Wounds of Metsuzai Temple"' },
  198: { ja: "不死「徐福時空」", en: 'Undying "Xu Fu\'s Dimension"' },
  199: { ja: "滅罪「正直者の死」", en: 'Expiation "Honest Man\'s Death"' },
  200: { ja: "虚人「ウー」", en: 'Hollow Being "Wu"' },
  201: {
    ja: "不滅「フェニックスの尾」",
    en: 'Inextinguishable "Phoenix\'s Tail"',
  },
  202: {
    ja: "蓬莱「凱風快晴　-フジヤマヴォルケイノ-」",
    en: 'Hourai "South Wind, Clear Sky -Fujiyama Volcano-"',
  },
  203: { ja: "「パゼストバイフェニックス」", en: '"Possessed by Phoenix"' },
  204: { ja: "「蓬莱人形」", en: '"Hourai Doll"' },
  205: {
    ja: "「インペリシャブルシューティング」",
    en: '"Imperishable Shooting"',
  },
  206: {
    ja: "「季節外れのバタフライストーム」",
    en: '"Unseasonal Butterfly Storm"',
  },
  207: { ja: "「ブラインドナイトバード」", en: '"Blind Nightbird"' },
  208: {
    ja: "「日出づる国の天子」",
    en: '"Emperor of the Land of the Rising Sun"',
  },
  209: {
    ja: "「幻朧月睨(ルナティックレッドアイズ)」",
    en: '"Stare of the Hazy Phantom Moon (Lunatic Red Eyes)"',
  },
  210: {
    ja: "「天網蜘網捕蝶の法」",
    en: '"Heaven Spider\'s Butterfly-Capturing Web"',
  },
  211: { ja: "「蓬莱の樹海」", en: '"Tree-Ocean of Hourai"' },
  212: { ja: "「フェニックス再誕」", en: '"Phoenix Rebirth"' },
  213: { ja: "「エンシェントデューパー」", en: '"Ancient Duper"' },
  214: { ja: "「無何有浄化」", en: '"Total Purification"' },
  215: { ja: "「夢想天生」", en: '"Fantasy Nature"' },
  216: { ja: "「ブレイジングスター」", en: '"Blazing Star"' },
  217: { ja: "「デフレーションワールド」", en: '"Deflation World"' },
  218: {
    ja: "「待宵反射衛星斬」",
    en: '"Matsuyoi-Reflecting Satellite Slash"',
  },
  219: {
    ja: "「グランギニョル座の怪人」",
    en: '"The Phantom of the Grand Guignol"',
  },
  220: { ja: "「スカーレットディスティニー」", en: '"Scarlet Destiny"' },
  221: { ja: "「西行寺無余涅槃」", en: '"Saigyouji Parinirvana"' },
  222: {
    ja: "「深弾幕結界　-夢幻泡影-」",
    en: '"Profound Danmaku Barrier -Phantasm, Foam, and Shadow-"',
  },
};
function convertSpellCard(spell_card_id: string) {
  return spellCardMap[spell_card_id] ?? { ja: "不明", en: "Unknown" };
}

const shotTypeMap: Record<string, { label: string; color: string }> = {
  Reimu_and_Yukari: { label: "結界組", color: "#ffb6c1" },
  Marisa_and_Alice: { label: "詠唱組", color: "#1e90ff" },
  Sakuya_and_Remilia: { label: "紅魔組", color: "#dc143c" },
  Youmu_and_Yuyuko: { label: "幽冥組", color: "#b0c4de" },
  Reimu: {
    label: "霊夢",
    color: useTableUtils().convertCharacter("Reimu").color,
  },
  Yukari: { label: "紫", color: "#ff69b4" },
  Marisa: {
    label: "魔理沙",
    color: useTableUtils().convertCharacter("Marisa").color,
  },
  Alice: { label: "アリス", color: "#6495ed" },
  Sakuya: {
    label: "咲夜",
    color: useTableUtils().convertCharacter("Sakuya").color,
  },
  Reimilia: { label: "レミリア", color: "#ff0000" },
  Youmu: {
    label: "妖夢",
    color: useTableUtils().convertCharacter("Youmu").color,
  },
  Yuyuko: { label: "幽々子", color: "#ffc0cb" },
};

function convertShotType(shot_type_id: string) {
  return shotTypeMap[shot_type_id] || { label: "Unknown", color: "white" };
}

interface Th08Replay {
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
    route: string;
    spell_card_id: string;
    slowdown: string;
    replay_type: string;
    stage_details: [
      {
        stage: string;
        score: string | null;
        point_items: string | null;
        graze: string | null;
        piv: string | null;
        power: string | null;
        lives: string | null;
        bombs: string | null;
      }
    ];
  };
}

export function Th08Table(replay: Th08Replay) {
  let optional_division = null;
  if (replay.replay_meta.replay_type === "spell_card") {
    optional_division = {
      label: convertSpellCard(replay.replay_meta.spell_card_id).ja,
      color: "light-blue-darken-3",
    };
  } else if (replay.replay_meta.route === "Final_A") {
    optional_division = { label: "Aルート", color: "purple-darken-1" };
  } else if (replay.replay_meta.route === "Final_B") {
    optional_division = { label: "Bルート", color: "pink-darken-1" };
  }

  return {
    game_meta: {
      theme_color: "#333399",
      img: {
        thumb: "/images/thumb/th08.png",
        full: "/images/full/th08.png",
        alt: "th08",
      },
      name: "東方永夜抄 〜 Imperishable Night.",
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
    slowdown: isNaN(Number(replay.replay_meta.slowdown))
      ? "N/A"
      : Number(replay.replay_meta.slowdown).toFixed(2) + "%",
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
          title: "得点アイテム数",
          key: "point_items",
          sortable: false,
        },
        {
          title: "人妖点",
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
        let stageLabel: string;

        switch (String(stage.stage)) {
          case "4":
            stageLabel = "4A";
            break;
          case "5":
            stageLabel = "4B";
            break;
          case "6":
            stageLabel = "5";
            break;
          case "7":
            stageLabel = "6A";
            break;
          case "8":
            stageLabel = "6B";
            break;
          case "9":
            stageLabel = "Ex";
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
          point_items:
            stage.point_items !== null
              ? Number(stage.point_items).toLocaleString()
              : "-",
          piv: stage.piv !== null ? Number(stage.piv).toLocaleString() : "-",
          graze:
            stage.graze !== null ? Number(stage.graze).toLocaleString() : "-",
        };
      }),
    },
  };
}
