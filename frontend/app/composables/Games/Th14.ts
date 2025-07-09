import { useTableUtils } from "./TableUtils"
const spellCardMap: Record<string, {ja: string, en: string}>={
  0:   {ja: "氷符「アルティメットブリザード」", en: 'Ice Sign "Ultimate Blizzard"'},
  1:   {ja: "氷符「アルティメットブリザード」", en: 'Ice Sign "Ultimate Blizzard"'},
  2:   {ja: "水符「テイルフィンスラップ」", en: 'Water Sign "Tail Fin Slap"'},
  3:   {ja: "水符「テイルフィンスラップ」", en: 'Water Sign "Tail Fin Slap"'},
  4:   {ja: "水符「テイルフィンスラップ」", en: 'Water Sign "Tail Fin Slap"'},
  5:   {ja: "水符「テイルフィンスラップ」", en: 'Water Sign "Tail Fin Slap"'},
  6:   {ja: "鱗符「スケールウェイブ」", en: 'Scale Sign "Scale Wave"'},
  7:   {ja: "鱗符「スケールウェイブ」", en: 'Scale Sign "Scale Wave"'},
  8:   {ja: "鱗符「逆鱗の荒波」", en: 'Scale Sign "Raging Waves of the Reversed Scale"'},
  9:   {ja: "鱗符「逆鱗の大荒波」", en: 'Scale Sign "Great Raging Waves of the Reversed Scale"'},
  10:  {ja: "飛符「フライングヘッド」", en: 'Flight Sign "Flying Head"'},
  11:  {ja: "飛符「フライングヘッド」", en: 'Flight Sign "Flying Head"'},
  12:  {ja: "飛符「フライングヘッド」", en: 'Flight Sign "Flying Head"'},
  13:  {ja: "飛符「フライングヘッド」", en: 'Flight Sign "Flying Head"'},
  14:  {ja: "首符「クローズアイショット」", en: 'Neck Sign "Close-Eye Shot"'},
  15:  {ja: "首符「クローズアイショット」", en: 'Neck Sign "Close-Eye Shot"'},
  16:  {ja: "首符「ろくろ首飛来」", en: 'Neck Sign "Rokurokubi Flight"'},
  17:  {ja: "首符「ろくろ首飛来」", en: 'Neck Sign "Rokurokubi Flight"'},
  18:  {ja: "飛頭「マルチプリケイティブヘッド」", en: 'Flying Head "Multiplicative Head"'},
  19:  {ja: "飛頭「マルチプリケイティブヘッド」", en: 'Flying Head "Multiplicative Head"'},
  20:  {ja: "飛頭「セブンズヘッド」", en: 'Flying Head "Seventh Head"'},
  21:  {ja: "飛頭「ナインズヘッド」", en: 'Flying Head "Ninth Head"'},
  22:  {ja: "飛頭「デュラハンナイト」", en: 'Flying Head "Dullahan Night"'},
  23:  {ja: "飛頭「デュラハンナイト」", en: 'Flying Head "Dullahan Night"'},
  24:  {ja: "飛頭「デュラハンナイト」", en: 'Flying Head "Dullahan Night"'},
  25:  {ja: "飛頭「デュラハンナイト」", en: 'Flying Head "Dullahan Night"'},
  26:  {ja: "牙符「月下の犬歯」", en: 'Fang Sign "Moonlit Canine Teeth"'},
  27:  {ja: "牙符「月下の犬歯」", en: 'Fang Sign "Moonlit Canine Teeth"'},
  28:  {ja: "変身「トライアングルファング」", en: 'Transformation "Triangle Fang"'},
  29:  {ja: "変身「トライアングルファング」", en: 'Transformation "Triangle Fang"'},
  30:  {ja: "変身「スターファング」", en: 'Transformation "Star Fang"'},
  31:  {ja: "変身「スターファング」", en: 'Transformation "Star Fang"'},
  32:  {ja: "咆哮「ストレンジロア」", en: 'Roar "Strange Roar"'},
  33:  {ja: "咆哮「ストレンジロア」", en: 'Roar "Strange Roar"'},
  34:  {ja: "咆哮「満月の遠吠え」", en: 'Roar "Full Moon Howling"'},
  35:  {ja: "咆哮「満月の遠吠え」", en: 'Roar "Full Moon Howling"'},
  36:  {ja: "狼符「スターリングパウンス」", en: 'Wolf Sign "Star Ring Pounce"'},
  37:  {ja: "狼符「スターリングパウンス」", en: 'Wolf Sign "Star Ring Pounce"'},
  38:  {ja: "天狼「ハイスピードパウンス」", en: 'Sirius "High-Speed Pounce"'},
  39:  {ja: "天狼「ハイスピードパウンス」", en: 'Sirius "High-Speed Pounce"'},
  40:  {ja: "平曲「祇園精舎の鐘の音」", en: 'Heikyoku "Sounds of Jetavana\'s Bell"'},
  41:  {ja: "平曲「祇園精舎の鐘の音」", en: 'Heikyoku "Sounds of Jetavana\'s Bell"'},
  42:  {ja: "平曲「祇園精舎の鐘の音」", en: 'Heikyoku "Sounds of Jetavana\'s Bell"'},
  43:  {ja: "平曲「祇園精舎の鐘の音」", en: 'Heikyoku "Sounds of Jetavana\'s Bell"'},
  44:  {ja: "怨霊「耳無し芳一」", en: 'Vengeful Spirit "Hoichi the Earless"'},
  45:  {ja: "怨霊「耳無し芳一」", en: 'Vengeful Spirit "Hoichi the Earless"'},
  46:  {ja: "怨霊「平家の大怨霊」", en: 'Vengeful Spirit "Great Vengeful Spirit of Taira"'},
  47:  {ja: "怨霊「平家の大怨霊」", en: 'Vengeful Spirit "Great Vengeful Spirit of Taira"'},
  48:  {ja: "楽符「邪悪な五線譜」", en: 'Music Sign "Wicked Musical Score"'},
  49:  {ja: "楽符「邪悪な五線譜」", en: 'Music Sign "Wicked Musical Score"'},
  50:  {ja: "楽符「凶悪な五線譜」", en: 'Music Sign "Malicious Musical Score"'},
  51:  {ja: "楽符「ダブルスコア」", en: 'Music Sign "Double Score"'},
  52:  {ja: "琴符「諸行無常の琴の音」", en: 'Koto Sign "Sounds of Anicca\'s Koto"'},
  53:  {ja: "琴符「諸行無常の琴の音」", en: 'Koto Sign "Sounds of Anicca\'s Koto"'},
  54:  {ja: "琴符「諸行無常の琴の音」", en: 'Koto Sign "Sounds of Anicca\'s Koto"'},
  55:  {ja: "琴符「諸行無常の琴の音」", en: 'Koto Sign "Sounds of Anicca\'s Koto"'},
  56:  {ja: "響符「平安の残響」", en: 'Echo Sign "Heian\'s Reverberation"'},
  57:  {ja: "響符「平安の残響」", en: 'Echo Sign "Heian\'s Reverberation"'},
  58:  {ja: "響符「エコーチェンバー」", en: 'Echo Sign "Echo Chamber"'},
  59:  {ja: "響符「エコーチェンバー」", en: 'Echo Sign "Echo Chamber"'},
  60:  {ja: "箏曲「下克上送箏曲」", en: 'Koto Music "Social Upheaval Koto Music Complement"'},
  61:  {ja: "箏曲「下克上送箏曲」", en: 'Koto Music "Social Upheaval Koto Music Complement"'},
  62:  {ja: "箏曲「下克上レクイエム」", en: 'Koto Music "Social Upheaval Requiem"'},
  63:  {ja: "箏曲「下克上レクイエム」", en: 'Koto Music "Social Upheaval Requiem"'},
  64:  {ja: "欺符「逆針撃」", en: 'Deceit Sign "Reverse Needle Attack"'},
  65:  {ja: "欺符「逆針撃」", en: 'Deceit Sign "Reverse Needle Attack"'},
  66:  {ja: "欺符「逆針撃」", en: 'Deceit Sign "Reverse Needle Attack"'},
  67:  {ja: "欺符「逆針撃」", en: 'Deceit Sign "Reverse Needle Attack"'},
  68:  {ja: "逆符「鏡の国の弾幕」", en: 'Reverse Sign "Danmaku Through the Looking-Glass"'},
  69:  {ja: "逆符「鏡の国の弾幕」", en: 'Reverse Sign "Danmaku Through the Looking-Glass"'},
  70:  {ja: "逆符「イビルインザミラー」", en: 'Reverse Sign "Evil in the Mirror"'},
  71:  {ja: "逆符「イビルインザミラー」", en: 'Reverse Sign "Evil in the Mirror"'},
  72:  {ja: "逆符「天地有用」", en: 'Reverse Sign "This Side Down"'},
  73:  {ja: "逆符「天地有用」", en: 'Reverse Sign "This Side Down"'},
  74:  {ja: "逆符「天下転覆」", en: 'Reverse Sign "Overturning All Under Heaven"'},
  75:  {ja: "逆符「天下転覆」", en: 'Reverse Sign "Overturning All Under Heaven"'},
  76:  {ja: "逆弓「天壌夢弓」", en: 'Reverse Bow "Dream Bow of Heaven & Earth"'},
  77:  {ja: "逆弓「天壌夢弓」", en: 'Reverse Bow "Dream Bow of Heaven & Earth"'},
  78:  {ja: "逆弓「天壌夢弓の詔勅」", en: 'Reverse Bow "Decree of the Dream Bow of Heaven & Earth"'},
  79:  {ja: "逆弓「天壌夢弓の詔勅」", en: 'Reverse Bow "Decree of the Dream Bow of Heaven & Earth"'},
  80:  {ja: "逆転「リバースヒエラルキー」", en: 'Turnabout "Reverse Hierarchy"'},
  81:  {ja: "逆転「リバースヒエラルキー」", en: 'Turnabout "Reverse Hierarchy"'},
  82:  {ja: "逆転「チェンジエアブレイブ」", en: 'Turnabout "Change Air Brave"'},
  83:  {ja: "逆転「チェンジエアブレイブ」", en: 'Turnabout "Change Air Brave"'},
  84:  {ja: "小弾「小人の道」", en: 'Small Barrage "Inchling\'s Path"'},
  85:  {ja: "小弾「小人の道」", en: 'Small Barrage "Inchling\'s Path"'},
  86:  {ja: "小弾「小人の茨道」", en: 'Small Barrage "Inchling\'s Thorny Path"'},
  87:  {ja: "小弾「小人の茨道」", en: 'Small Barrage "Inchling\'s Thorny Path"'},
  88:  {ja: "小槌「大きくなあれ」", en: 'Mallet "Grow Bigger!"'},
  89:  {ja: "小槌「大きくなあれ」", en: 'Mallet "Grow Bigger!"'},
  90:  {ja: "小槌「もっと大きくなあれ」", en: 'Mallet "Grow Even Bigger!"'},
  91:  {ja: "小槌「もっと大きくなあれ」", en: 'Mallet "Grow Even Bigger!"'},
  92:  {ja: "妖剣「輝針剣」", en: 'Bewitched Sword "Shining Needle Sword"'},
  93:  {ja: "妖剣「輝針剣」", en: 'Bewitched Sword "Shining Needle Sword"'},
  94:  {ja: "妖剣「輝針剣」", en: 'Bewitched Sword "Shining Needle Sword"'},
  95:  {ja: "妖剣「輝針剣」", en: 'Bewitched Sword "Shining Needle Sword"'},
  96:  {ja: "小槌「お前が大きくなあれ」", en: 'Mallet "You Grow Bigger!"'},
  97:  {ja: "小槌「お前が大きくなあれ」", en: 'Mallet "You Grow Bigger!"'},
  98:  {ja: "小槌「お前が大きくなあれ」", en: 'Mallet "You Grow Bigger!"'},
  99:  {ja: "小槌「お前が大きくなあれ」", en: 'Mallet "You Grow Bigger!"'},
  100: {ja: "「進撃の小人」", en: '"Attack on Dwarf"'},
  101: {ja: "「進撃の小人」", en: '"Attack on Dwarf"'},
  102: {ja: "「ウォールオブイッスン」", en: '"Wall of Issun"'},
  103: {ja: "「ウォールオブイッスン」", en: '"Wall of Issun"'},
  104: {ja: "「ホップオマイサムセブン」", en: '"Hop-o\'-My-Thumb Seven"'},
  105: {ja: "「ホップオマイサムセブン」", en: '"Hop-o\'-My-Thumb Seven"'},
  106: {ja: "「七人の一寸法師」", en: '"The Seven Issun-Boshi"'},
  107: {ja: "「七人の一寸法師」", en: '"The Seven Issun-Boshi"'},
  108: {ja: "弦楽「嵐のアンサンブル」", en: 'String Music "Storm Ensemble"'},
  109: {ja: "弦楽「浄瑠璃世界」", en: 'String Music "Joururi World"'},
  110: {ja: "一鼓「暴れ宮太鼓」", en: 'First Drum "Raging Temple Taiko"'},
  111: {ja: "二鼓「怨霊アヤノツヅミ」", en: 'Second Drum "Vengeful Spirit Aya-no-Tsuzumi"'},
  112: {ja: "三鼓「午前零時のスリーストライク」", en: 'Third Drum "Three Strikes at Midnight"'},
  113: {ja: "死鼓「ランドパーカス」", en: 'Death Drum "Land Percuss"'},
  114: {ja: "五鼓「デンデン太鼓」", en: 'Fifth Drum "Den-Den Daiko"'},
  115: {ja: "六鼓「オルタネイトスティッキング」", en: 'Sixth Drum "Alternate Sticking"'},
  116: {ja: "七鼓「高速和太鼓ロケット」", en: 'Seventh Drum "High Speed Taiko Rocket"'},
  117: {ja: "八鼓「雷神の怒り」", en: 'Eighth Drum "Thunder God\'s Anger"'},
  118: {ja: "「ブルーレディショー」", en: '"Blue Lady Show"'},
  119: {ja: "「プリスティンビート」", en: '"Pristine Beat"'},
}
function convertSpellCard(spell_card_id: string){
  return spellCardMap[spell_card_id] ?? {ja: "不明", en: "Unknown"}
}

const shotTypeMap: Record<string, {label: string, color: string}> = {
  ReimuA:       {label: '霊夢A', color: useTableUtils().convertCharacter('Reimu').color},
  ReimuB:       {label: '霊夢B', color: useTableUtils().convertCharacter('Reimu').color},
  MarisaA:      {label: '魔理沙A', color: useTableUtils().convertCharacter('Marisa').color},
  MarisaB:      {label: '魔理沙B', color: useTableUtils().convertCharacter('Marisa').color},
  SakuyaA:      {label: '咲夜A', color: useTableUtils().convertCharacter('Sakuya').color},
  SakuyaB:      {label: '咲夜B', color: useTableUtils().convertCharacter('Sakuya').color},
}

function convertShotType(shot_type_id: string){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

interface Th14Replay{
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

export function Th14Table(replay: Th14Replay){

  let optional_division=null
  if (replay.replay_meta.replay_type==='spell_card'){
    optional_division={label: convertSpellCard(replay.replay_meta.spell_card_id).ja, color: 'light-blue-darken-3'}
  }

  return{
    game_meta:{
      theme_color: '#AA7777',
      img: {
        thumb: '/images/thumb/th14.png',
        full: '/images/full/th14.png',
        alt: 'th14'
      },
      name: '東方輝針城 〜 Double Dealing Character.'
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
    replay_id: replay.replay_id,
    stage_details: {
      headers: [
        {
          title: 'ステージ',
          key: 'stage',
          sortable: false,
          fixed: true,
        },
        {
          title: 'スコア',
          key: 'score',
          sortable: false,
        },
        {
          title: '残機',
          key: 'lives',
          sortable: false,
        },
        {
          title: 'ボム',
          key: 'bombs',
          sortable: false,
        },
        {
          title: 'パワー',
          key: 'power',
          sortable: false,
        },
        {
          title: '最大得点',
          key: 'piv',
          sortable: false,
        },
        {
          title: 'グレイズ',
          key: 'graze',
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map(stage => {
        let lifeLabel
        if (stage.lives !== null && stage.life_pieces !== null){
          lifeLabel = String(stage.lives) + ' + (' + String(stage.life_pieces) + '/3)'
        }else{
          lifeLabel = '-'
        }

        let bombLabel
        if (stage.bombs !== null && stage.bomb_pieces !== null){
          bombLabel = String(stage.bombs) + ' + (' + String(stage.bomb_pieces) + '/8)'
        }else{
          bombLabel = '-'
        }

        return {
          stage: String(stage.stage) !== '7' ? stage.stage : 'Ex',
          score: stage.score !== null ? Number(stage.score).toLocaleString() : '-',
          power: stage.power !== null ? (Number(stage.power) / 100).toFixed(2) : '-',
          lives: lifeLabel,
          bombs: bombLabel,
          piv: stage.piv !== null ? Number(stage.piv).toLocaleString() : '-',
          graze: stage.graze !== null ? Number(stage.graze).toLocaleString() : '-',
        }
      })
    }
  }
}