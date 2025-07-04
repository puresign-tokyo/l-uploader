import { useTableUtils } from "./TableUtils"
const spellCardMap: Record<string, {ja: string, en: string}>={
  1: {ja: "招符「弾幕万来」", en: 'Beckon Sign "Danmaku Business Boom"'},
  2: {ja: "招符「弾幕万来」", en: 'Beckon Sign "Danmaku Business Boom"'},
  3: {ja: "招符「弾幕万来」", en: 'Beckon Sign "Danmaku Business Boom"'},
  4: {ja: "招符「弾幕万来」", en: 'Beckon Sign "Danmaku Business Boom"'},
  5: {ja: "招符「弾災招福」", en: 'Beckon Sign "Shoot Away Disaster, Beckon in Fortune"'},
  6: {ja: "招符「弾災招福」", en: 'Beckon Sign "Shoot Away Disaster, Beckon in Fortune"'},
  7: {ja: "招符「弾災招福」", en: 'Beckon Sign "Shoot Away Disaster, Beckon in Fortune"'},
  8: {ja: "招符「弾災招福」", en: 'Beckon Sign "Shoot Away Disaster, Beckon in Fortune"'},
  9: {ja: "森符「木隠れの技術」", en: 'Forest Sign "Tree-Veiling Technology"'},
  10: {ja: "森符「木隠れの技術」", en: 'Forest Sign "Tree-Veiling Technology"'},
  11: {ja: "森符「極・木隠れの技術」", en: 'Forest Sign "Extreme Tree-Veiling Technology"'},
  12: {ja: "森符「真・木隠れの技術」", en: 'Forest Sign "True Tree-Veiling Technology"'},
  13: {ja: "森符「最奥の森域」", en: 'Forest Sign "Innermost Forest Region"'},
  14: {ja: "森符「最奥の森域」", en: 'Forest Sign "Innermost Forest Region"'},
  15: {ja: "森符「極・最奥の森域」", en: 'Forest Sign "Extreme Innermost Forest Region"'},
  16: {ja: "森符「真・最奥の森域」", en: 'Forest Sign "True Innermost Forest Region"'},
  17: {ja: "葉技「グリーンスパイラル」", en: 'Leaf Skill "Green Spiral"'},
  18: {ja: "葉技「グリーンスパイラル」", en: 'Leaf Skill "Green Spiral"'},
  19: {ja: "葉技「グリーンサイクロン」", en: 'Leaf Skill "Green Cyclone"'},
  20: {ja: "葉技「グリーントルネード」", en: 'Leaf Skill "Green Tornado"'},
  21: {ja: "山符「動天の雲間草」", en: 'Mountain Sign "Heaven-Shaking Kumomagusa"'},
  22: {ja: "山符「動天の雲間草」", en: 'Mountain Sign "Heaven-Shaking Kumomagusa"'},
  23: {ja: "山怪「驚愕の雲間草」", en: 'Mountain Apparition "Astonishing Kumomagusa"'},
  24: {ja: "山怪「驚愕の雲間草」", en: 'Mountain Apparition "Astonishing Kumomagusa"'},
  25: {ja: "山符「妖光輝く薄雪草」", en: 'Mountain Sign "Usuyukisou Shining with Bewitching Light"'},
  26: {ja: "山符「妖光輝く薄雪草」", en: 'Mountain Sign "Usuyukisou Shining with Bewitching Light"'},
  27: {ja: "山怪「妖魔犇めく薄雪草」", en: 'Mountain Apparition "Usuyukisou of Thronging Crowds of Youma"'},
  28: {ja: "山怪「妖魔犇めく薄雪草」", en: 'Mountain Apparition "Usuyukisou of Thronging Crowds of Youma"'},
  29: {ja: "山花「殺戮の駒草」", en: 'Mountain Flower "Komakusa of Massacre"'},
  30: {ja: "山花「殺戮の駒草」", en: 'Mountain Flower "Komakusa of Massacre"'},
  31: {ja: "山花「殺戮の山の女王」", en: 'Mountain Flower "Mountain Queen of Massacre"'},
  32: {ja: "山花「殺戮の山の女王」", en: 'Mountain Flower "Mountain Queen of Massacre"'},
  33: {ja: "玉符「虹龍陰陽玉」", en: 'Orb Sign "Rainbow Dragon Yin-Yang Orbs"'},
  34: {ja: "玉符「虹龍陰陽玉」", en: 'Orb Sign "Rainbow Dragon Yin-Yang Orbs"'},
  35: {ja: "玉符「虹龍陰陽玉」", en: 'Orb Sign "Rainbow Dragon Yin-Yang Orbs"'},
  36: {ja: "玉符「陰陽神玉」", en: 'Orb Sign "Yin-Yang Divine Orbs"'},
  37: {ja: "玉将「クイーンオブインヤンスフィア」", en: 'Jeweled General "Queen of Yin-Yang Sphere"'},
  38: {ja: "玉将「クイーンオブインヤンスフィア」", en: 'Jeweled General "Queen of Yin-Yang Sphere"'},
  39: {ja: "女王珠「虹の扉の向こうに」", en: 'Queenly Gem "Beyond the Rainbow Door"'},
  40: {ja: "女王珠「虹の扉の向こうに」", en: 'Queenly Gem "Beyond the Rainbow Door"'},
  41: {ja: "「陰陽サフォケイション」", en: '"Yin-Yang Suffocation"'},
  42: {ja: "「陰陽サフォケイション」", en: '"Yin-Yang Suffocation"'},
  43: {ja: "「陰陽サフォケイション」", en: '"Yin-Yang Suffocation"'},
  44: {ja: "「陰陽サフォケイション」", en: '"Yin-Yang Suffocation"'},
  45: {ja: "禍星「星火燎原の舞」", en: 'Calamitous Star "Dance of Star-Sparked Wildfire"'},
  46: {ja: "禍星「星火燎原の舞」", en: 'Calamitous Star "Dance of Star-Sparked Wildfire"'},
  47: {ja: "禍星「星火燎原乱舞」", en: 'Calamitous Star "Wild Dance of Star-Sparked Wildfire"'},
  48: {ja: "禍星「星火燎原乱舞」", en: 'Calamitous Star "Wild Dance of Star-Sparked Wildfire"'},
  49: {ja: "星風「虹彩陸離の舞」", en: 'Stellar Wind "Dance of Dazzling Iridescence"'},
  50: {ja: "星風「虹彩陸離の舞」", en: 'Stellar Wind "Dance of Dazzling Iridescence"'},
  51: {ja: "星風「虹彩陸離乱舞」", en: 'Stellar Wind "Wild Dance of Dazzling Iridescence"'},
  52: {ja: "星風「虹彩陸離乱舞」", en: 'Stellar Wind "Wild Dance of Dazzling Iridescence"'},
  53: {ja: "光馬「天馬行空の舞」", en: 'Luminous Horse "Dance of Sky-Racing Heavenly Steeds"'},
  54: {ja: "光馬「天馬行空の舞」", en: 'Luminous Horse "Dance of Sky-Racing Heavenly Steeds"'},
  55: {ja: "光馬「天馬行空乱舞」", en: 'Luminous Horse "Wild Dance of Sky-Racing Heavenly Steeds"'},
  56: {ja: "光馬「天馬行空乱舞」", en: 'Luminous Horse "Wild Dance of Sky-Racing Heavenly Steeds"'},
  57: {ja: "虹光「光風霽月」", en: 'Rainbow Illumination "Clear and Tranquil Wind and Moon"'},
  58: {ja: "虹光「光風霽月」", en: 'Rainbow Illumination "Clear and Tranquil Wind and Moon"'},
  59: {ja: "虹光「光風霽月」", en: 'Rainbow Illumination "Clear and Tranquil Wind and Moon"'},
  60: {ja: "虹光「光風霽月」", en: 'Rainbow Illumination "Clear and Tranquil Wind and Moon"'},
  61: {ja: "「無主への供物」", en: '"An Offering to the Ownerless"'},
  62: {ja: "「無主への供物」", en: '"An Offering to the Ownerless"'},
  63: {ja: "「無主への供物」", en: '"An Offering to the Ownerless"'},
  64: {ja: "「無主への供物」", en: '"An Offering to the Ownerless"'},
  65: {ja: "「弾幕狂蒐家の妄執」", en: '"Danmaku Hoarder\'s Obsession"'},
  66: {ja: "「弾幕狂蒐家の妄執」", en: '"Danmaku Hoarder\'s Obsession"'},
  67: {ja: "「弾幕狂蒐家の妄執」", en: '"Danmaku Hoarder\'s Obsession"'},
  68: {ja: "「弾幕狂蒐家の妄執」", en: '"Danmaku Hoarder\'s Obsession"'},
  69: {ja: "「バレットマーケット」", en: '"Bullet Market"'},
  70: {ja: "「バレットマーケット」", en: '"Bullet Market"'},
  71: {ja: "「密度の高いバレットマーケット」", en: '"High Density Bullet Market"'},
  72: {ja: "「弾幕自由市場」", en: '"Danmaku Free Market"'},
  73: {ja: "「虹人環」", en: '"Rainbow Ring of People"'},
  74: {ja: "「虹人環」", en: '"Rainbow Ring of People"'},
  75: {ja: "「虹人環」", en: '"Rainbow Ring of People"'},
  76: {ja: "「虹人環」", en: '"Rainbow Ring of People"'},
  77: {ja: "「バレットドミニオン」", en: '"Bullet Dominion"'},
  78: {ja: "「バレットドミニオン」", en: '"Bullet Dominion"'},
  79: {ja: "「暴虐のバレットドミニオン」", en: '"Tyrannical Bullet Dominion"'},
  80: {ja: "「無道のバレットドミニオン」", en: '"Inhumane Bullet Dominion"'},
  81: {ja: "「弾幕のアジール」", en: '"Asylum of Danmaku"'},
  82: {ja: "「弾幕のアジール」", en: '"Asylum of Danmaku"'},
  83: {ja: "「弾幕のアジール」", en: '"Asylum of Danmaku"'},
  84: {ja: "「弾幕のアジール」", en: '"Asylum of Danmaku"'},
  85: {ja: "狐符「フォックスワインダー」", en: 'Fox Sign "Fox Winder"'},
  86: {ja: "管狐「シリンダーフォックス」", en: 'Kuda-gitsune "Cylinder Fox"'},
  87: {ja: "星狐「天狐龍星の舞」", en: 'Stellar Fox "Dance of Heavenly Foxes and Dragon Stars"'},
  88: {ja: "蠱毒「カニバリスティックインセクト」", en: 'Kodoku "Cannibalistic Insect"'},
  89: {ja: "蠱毒「ケイブスウォーマー」", en: 'Kodoku "Cave Swarmer"'},
  90: {ja: "蠱毒「スカイペンドラ」", en: 'Kodoku "Sky Pendra"'},
  91: {ja: "採掘「積もり続けるマインダンプ」", en: 'Mining "Ever-Accumulating Mine Dump"'},
  92: {ja: "採掘「マインブラスト」", en: 'Mining "Mine Blast"'},
  93: {ja: "採掘「妖怪達のシールドメソッド」", en: 'Mining "Shield Method of the Youkai"'},
  94: {ja: "大蜈蚣「スネークイーター」", en: 'Oomukade "Snake Eater"'},
  95: {ja: "大蜈蚣「ドラゴンイーター」", en: 'Oomukade "Dragon Eater"'},
  96: {ja: "「蠱毒のグルメ」", en: '"Kodoku Gourmet"'},
  97: {ja: "「蟲姫さまの輝かしく落ち着かない毎日」", en: '"Mushihime-sama\'s Resplendent and Restless Daily Life"'},
}

function convertSpellCard(spell_card_id: string){
  return spellCardMap[spell_card_id] ?? {ja: "不明", en: "Unknown"}
}

const shotTypeMap: Record<string, {label: string, color: string}> = {
  Reimu:        useTableUtils().convertCharacter('Reimu'),
  Marisa:       useTableUtils().convertCharacter('Marisa'),
  Sakuya:       useTableUtils().convertCharacter('Sakuya'),
  Sanae:        useTableUtils().convertCharacter('Sanae'),
}


function convertShotType(shot_type_id: string){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

interface Th18Replay{
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
    shot_type: string,
    difficulty: string,
    total_score: string,
    slowdown: string,
    timestamp: string,
    replay_type: string,
    spell_card_id: string,
    stage_details: [
      {
        stage: string,
        score: string | null,
        power: string | null,
        piv: string | null,
        lives: string | null,
        life_pieces: string | null,
        bombs: string | null,
        bomb_pieces: string | null,
        graze: string | null,
      }
    ]
  }
}

export function Th18Table(replay: Th18Replay){

  let optional_division=null
  if (replay.replay_meta.replay_type==='spell_card'){
    optional_division={label: convertSpellCard(replay.replay_meta.spell_card_id).ja, color: 'light-blue-darken-3'}
  }

  return{
    game_meta:{
      theme_color: '#1DD294',
      img: {
        thumb: '/images/thumb/th18.png',
        full: '/images/full/th18.png',
        alt: 'th18'
      },
      name: '東方虹龍洞 〜 Unconnected Marketeers.'
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: (Number(replay.replay_meta.slowdown)).toFixed(2) + '%',
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}),
    difficulty: useTableUtils().convertDifficulty(replay.replay_meta.difficulty),
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: optional_division,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(replay.replay_meta.replay_type),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id
  }
}