import { useTableUtils } from "./TableUtils"

const spellCardMap: Record<string, {ja: string, en: string}>={
  0: {ja: "蝶符「ミニットスケールス」", en: 'Butterfly Sign "Minute Scales"'},
  1: {ja: "蝶符「ミニットスケールス」", en: 'Butterfly Sign "Minute Scales"'},
  2: {ja: "蝶符「アゲハの鱗粉」", en: 'Butterfly Sign "Swallowtail\'s Scales"'},
  3: {ja: "蝶符「アゲハの鱗粉」", en: 'Butterfly Sign "Swallowtail\'s Scales"'},
  4: {ja: "蝶符「フラッタリングサマー」", en: 'Butterfly Sign "Fluttering Summer"'},
  5: {ja: "蝶符「フラッタリングサマー」", en: 'Butterfly Sign "Fluttering Summer"'},
  6: {ja: "蝶符「真夏の羽ばたき」", en: 'Butterfly Sign "Midsummer Wingbeats"'},
  7: {ja: "蝶符「真夏の羽ばたき」", en: 'Butterfly Sign "Midsummer Wingbeats"'},
  8: {ja: "雨符「囚われの秋雨」", en: 'Rain Sign "Imprisoning Autumn Rain"'},
  9: {ja: "雨符「囚われの秋雨」", en: 'Rain Sign "Imprisoning Autumn Rain"'},
  10: {ja: "雨符「呪われた柴榑雨」", en: 'Rain Sign "Cursed Torrential Rain"'},
  11: {ja: "雨符「呪われた柴榑雨」", en: 'Rain Sign "Cursed Torrential Rain"'},
  12: {ja: "刃符「山姥の包丁研ぎ」", en: 'Blade Sign "Yamanba\'s Kitchen Knife Sharpening"'},
  13: {ja: "刃符「山姥の包丁研ぎ」", en: 'Blade Sign "Yamanba\'s Kitchen Knife Sharpening"'},
  14: {ja: "刃符「山姥の鬼包丁研ぎ」", en: 'Blade Sign "Yamanba\'s Oni Kitchen Knife Sharpening"'},
  15: {ja: "刃符「山姥の鬼包丁研ぎ」", en: 'Blade Sign "Yamanba\'s Oni Kitchen Knife Sharpening"'},
  16: {ja: "尽符「マウンテンマーダー」", en: 'Blade Exhaustion Sign "Mountain Murder"'},
  17: {ja: "尽符「マウンテンマーダー」", en: 'Blade Exhaustion Sign "Mountain Murder"'},
  18: {ja: "尽符「ブラッディマウンテンマーダー」", en: 'Blade Exhaustion Sign "Bloody Mountain Murder"'},
  19: {ja: "尽符「ブラッディマウンテンマーダー」", en: 'Blade Exhaustion Sign "Bloody Mountain Murder"'},
  20: {ja: "春符「サプライズスプリング」", en: 'Spring Sign "Surprise Spring"'},
  21: {ja: "春符「サプライズスプリング」", en: 'Spring Sign "Surprise Spring"'},
  22: {ja: "犬符「野良犬の散歩」", en: 'Dog Sign "Stray Dog\'s Walk"'},
  23: {ja: "犬符「野良犬の散歩」", en: 'Dog Sign "Stray Dog\'s Walk"'},
  24: {ja: "狗符「山狗の散歩」", en: 'Hound Sign "Mountain Hound\'s Walk"'},
  25: {ja: "狗符「山狗の散歩」", en: 'Hound Sign "Mountain Hound\'s Walk"'},
  26: {ja: "独楽「コマ犬回し」", en: 'Spinning Top "Koma-Inu Spin"'},
  27: {ja: "独楽「コマ犬回し」", en: 'Spinning Top "Koma-Inu Spin"'},
  28: {ja: "独楽「コマ犬回し」", en: 'Spinning Top "Koma-Inu Spin"'},
  29: {ja: "独楽「カールアップアンドダイ」", en: 'Spinning Top "Curl Up and Die"'},
  30: {ja: "狛符「独り阿吽の呼吸」", en: 'Koma Sign "Solitary A-Um Breathing"'},
  31: {ja: "狛符「独り阿吽の呼吸」", en: 'Koma Sign "Solitary A-Um Breathing"'},
  32: {ja: "狛符「独り阿吽の呼吸」", en: 'Koma Sign "Solitary A-Um Breathing"'},
  33: {ja: "狛符「独り阿吽の呼吸」", en: 'Koma Sign "Solitary A-Um Breathing"'},
  34: {ja: "魔符「インスタントボーディ」", en: 'Magic Sign "Instant Bodhi"'},
  35: {ja: "魔符「インスタントボーディ」", en: 'Magic Sign "Instant Bodhi"'},
  36: {ja: "魔符「即席菩提」", en: 'Magic Sign "Bodhi in an Instant"'},
  37: {ja: "魔符「即席菩提」", en: 'Magic Sign "Bodhi in an Instant"'},
  38: {ja: "魔符「バレットゴーレム」", en: 'Magic Sign "Bullet Golem"'},
  39: {ja: "魔符「バレットゴーレム」", en: 'Magic Sign "Bullet Golem"'},
  40: {ja: "魔符「ペットの巨大弾生命体」", en: 'Magic Sign "Gigantic Pet Bullet Lifeform"'},
  41: {ja: "魔符「ペットの巨大弾生命体」", en: 'Magic Sign "Gigantic Pet Bullet Lifeform"'},
  42: {ja: "地蔵「クリミナルサルヴェイション」", en: 'Jizo "Criminal Salvation"'},
  43: {ja: "地蔵「クリミナルサルヴェイション」", en: 'Jizo "Criminal Salvation"'},
  44: {ja: "地蔵「業火救済」", en: 'Jizo "Hellfire Salvation"'},
  45: {ja: "地蔵「業火救済」", en: 'Jizo "Hellfire Salvation"'},
  46: {ja: "竹符「バンブースピアダンス」", en: 'Bamboo Sign "Bamboo Spear Dance"'},
  47: {ja: "竹符「バンブースピアダンス」", en: 'Bamboo Sign "Bamboo Spear Dance"'},
  48: {ja: "竹符「バンブークレイジーダンス」", en: 'Bamboo Sign "Bamboo Crazy Dance"'},
  49: {ja: "竹符「バンブークレイジーダンス」", en: 'Bamboo Sign "Bamboo Crazy Dance"'},
  50: {ja: "茗荷「フォゲットユアネーム」", en: 'Myōga Ginger "Forget Your Name"'},
  51: {ja: "茗荷「フォゲットユアネーム」", en: 'Myōga Ginger "Forget Your Name"'},
  52: {ja: "茗荷「フォゲットユアネーム」", en: 'Myōga Ginger "Forget Your Name"'},
  53: {ja: "茗荷「フォゲットユアネーム」", en: 'Myōga Ginger "Forget Your Name"'},
  54: {ja: "笹符「タナバタスターフェスティバル」", en: 'Broadleaf Sign "Tanabata Star Festival"'},
  55: {ja: "笹符「タナバタスターフェスティバル」", en: 'Broadleaf Sign "Tanabata Star Festival"'},
  56: {ja: "笹符「タナバタスターフェスティバル」", en: 'Broadleaf Sign "Tanabata Star Festival"'},
  57: {ja: "笹符「タナバタスターフェスティバル」", en: 'Broadleaf Sign "Tanabata Star Festival"'},
  58: {ja: "冥加「ビハインドユー」", en: 'Myōga Blessing "Behind You"'},
  59: {ja: "冥加「ビハインドユー」", en: 'Myōga Blessing "Behind You"'},
  60: {ja: "冥加「ビハインドユー」", en: 'Myōga Blessing "Behind You"'},
  61: {ja: "冥加「ビハインドユー」", en: 'Myōga Blessing "Behind You"'},
  62: {ja: "舞符「ビハインドフェスティバル」", en: 'Dance Sign "Behind Festival"'},
  63: {ja: "舞符「ビハインドフェスティバル」", en: 'Dance Sign "Behind Festival"'},
  64: {ja: "舞符「ビハインドフェスティバル」", en: 'Dance Sign "Behind Festival"'},
  65: {ja: "舞符「ビハインドフェスティバル」", en: 'Dance Sign "Behind Festival"'},
  66: {ja: "狂舞「テングオドシ」", en: 'Mad Dance "Tengu-odoshi"'},
  67: {ja: "狂舞「テングオドシ」", en: 'Mad Dance "Tengu-odoshi"'},
  68: {ja: "狂舞「狂乱天狗怖し」", en: 'Mad Dance "Frenzied Tengu-Frightening"'},
  69: {ja: "狂舞「狂乱天狗怖し」", en: 'Mad Dance "Frenzied Tengu-Frightening"'},
  70: {ja: "後符「秘神の後光」", en: 'Back Sign "Halo of the Secret God"'},
  71: {ja: "後符「秘神の後光」", en: 'Back Sign "Halo of the Secret God"'},
  72: {ja: "後符「秘神の後光」", en: 'Back Sign "Halo of the Secret God"'},
  73: {ja: "後符「絶対秘神の後光」", en: 'Back Sign "Halo of the Absolute Secret God"'},
  74: {ja: "裏夏「スコーチ・バイ・ホットサマー」", en: 'Hidden Summer "Scorch By Hot Summer"'},
  75: {ja: "裏夏「スコーチ・バイ・ホットサマー」", en: 'Hidden Summer "Scorch By Hot Summer"'},
  76: {ja: "裏夏「異常猛暑の焦土」", en: 'Hidden Summer "Scorched Earth of Abnormal Intense Heat"'},
  77: {ja: "裏夏「異常猛暑の焦土」", en: 'Hidden Summer "Scorched Earth of Abnormal Intense Heat"'},
  78: {ja: "裏秋「ダイ・オブ・ファミン」", en: 'Hidden Fall "Die of Famine"'},
  79: {ja: "裏秋「ダイ・オブ・ファミン」", en: 'Hidden Fall "Die of Famine"'},
  80: {ja: "裏秋「異常枯死の餓鬼」", en: 'Hidden Fall "Preta of Abnormal Blight"'},
  81: {ja: "裏秋「異常枯死の餓鬼」", en: 'Hidden Fall "Preta of Abnormal Blight"'},
  82: {ja: "裏冬「ブラックスノーマン」", en: 'Hidden Winter "Black Snowman"'},
  83: {ja: "裏冬「ブラックスノーマン」", en: 'Hidden Winter "Black Snowman"'},
  84: {ja: "裏冬「異常降雪の雪だるま」", en: 'Hidden Winter "Snowman of Abnormal Snowfall"'},
  85: {ja: "裏冬「異常降雪の雪だるま」", en: 'Hidden Winter "Snowman of Abnormal Snowfall"'},
  86: {ja: "裏春「エイプリルウィザード」", en: 'Hidden Spring "April Wizard"'},
  87: {ja: "裏春「エイプリルウィザード」", en: 'Hidden Spring "April Wizard"'},
  88: {ja: "裏春「異常落花の魔術使い」", en: 'Hidden Spring "Black Magician of Abnormal Falling Petals"'},
  89: {ja: "裏春「異常落花の魔術使い」", en: 'Hidden Spring "Black Magician of Abnormal Falling Petals"'},
  90: {ja: "「裏・ブリージーチェリーブロッサム」", en: '"Hidden Breezy Cherry Blossom"'},
  91: {ja: "「裏・ブリージーチェリーブロッサム」", en: '"Hidden Breezy Cherry Blossom"'},
  92: {ja: "「裏・ブリージーチェリーブロッサム」", en: '"Hidden Breezy Cherry Blossom"'},
  93: {ja: "「裏・ブリージーチェリーブロッサム」", en: '"Hidden Breezy Cherry Blossom"'},
  94: {ja: "「裏・パーフェクトサマーアイス」", en: '"Hidden Perfect Summer Ice"'},
  95: {ja: "「裏・パーフェクトサマーアイス」", en: '"Hidden Perfect Summer Ice"'},
  96: {ja: "「裏・パーフェクトサマーアイス」", en: '"Hidden Perfect Summer Ice"'},
  97: {ja: "「裏・パーフェクトサマーアイス」", en: '"Hidden Perfect Summer Ice"'},
  98: {ja: "「裏・クレイジーフォールウィンド」", en: '"Hidden Crazy Fall Wind"'},
  99: {ja: "「裏・クレイジーフォールウィンド」", en: '"Hidden Crazy Fall Wind"'},
  100:{ ja: "「裏・クレイジーフォールウィンド」", en: '"Hidden Crazy Fall Wind"'},
  101:{ ja: "「裏・クレイジーフォールウィンド」", en: '"Hidden Crazy Fall Wind"'},
  102:{ ja: "「裏・エクストリームウィンター」", en: '"Hidden Extreme Winter"'},
  103:{ ja: "「裏・エクストリームウィンター」", en: '"Hidden Extreme Winter"'},
  104:{ ja: "「裏・エクストリームウィンター」", en: '"Hidden Extreme Winter"'},
  105:{ ja: "「裏・エクストリームウィンター」", en: '"Hidden Extreme Winter"'},
  106:{ ja: "鼓舞「パワフルチアーズ」", en: 'Drum Dance "Powerful Cheers"'},
  107:{ ja: "狂舞「クレイジーバックダンス」", en: 'Mad Dance "Crazy Backup Dance"'},
  108:{ ja: "弾舞「二つ目の台風」", en: 'Bullet Dance "Twin Typhoons"'},
  109:{ ja: "秘儀「リバースインヴォーカー」", en: 'Secret Ceremony "Reverse Invoker"'},
  110:{ ja: "秘儀「裏切りの後方射撃」", en: 'Secret Ceremony "Rear Shots of Betrayal"'},
  111:{ ja: "秘儀「弾幕の玉繭」", en: 'Secret Ceremony "Danmaku Dupion"'},
  112:{ ja: "秘儀「穢那の火」", en: 'Secret Ceremony "Fire of Ena"'},
  113:{ ja: "秘儀「後戸の狂言」", en: 'Secret Ceremony "Kyōgen of the Back Door"'},
  114:{ ja: "秘儀「マターラドゥッカ」", en: 'Secret Ceremony "Matarah Dukkha"'},
  115:{ ja: "秘儀「七星の剣」", en: 'Secret Ceremony "Sword of the Seven Stars"'},
  116:{ ja: "秘儀「無縁の芸能者」", en: 'Secret Ceremony "Performers Unattached to Society"'},
  117:{ ja: "「背面の暗黒猿楽」", en: '"The Back Face\'s Dark Sarugaku"'},
  118:{ ja: "「アナーキーバレットヘル」", en: '"Anarchy Bullet Hell"'},    
}

function convertSpellCard(spell_card_id: string){
  return spellCardMap[spell_card_id] ?? {ja: "不明", en: "Unknown"}
}

const shotTypeMap: Record<string, {label: string, color: string}> = {
  ReimuSpring:       {label: '霊夢(春)', color: useTableUtils().convertCharacter('Reimu').color},
  ReimuSummer:       {label: '霊夢(夏)', color: useTableUtils().convertCharacter('Reimu').color},
  ReimuAutumn:       {label: '霊夢(秋)', color: useTableUtils().convertCharacter('Reimu').color},
  ReimuWinter:       {label: '霊夢(冬)', color: useTableUtils().convertCharacter('Reimu').color},
  Reimu:             {label: '霊夢(土用)', color: useTableUtils().convertCharacter('Reimu').color},
  MarisaSpring:      {label: '魔理沙(春)', color: useTableUtils().convertCharacter('Marisa').color},
  MarisaSummer:      {label: '魔理沙(夏)', color: useTableUtils().convertCharacter('Marisa').color},
  MarisaAutumn:      {label: '魔理沙(秋)', color: useTableUtils().convertCharacter('Marisa').color},
  MarisaWinter:      {label: '魔理沙(冬)', color: useTableUtils().convertCharacter('Marisa').color},
  Marisa:            {label: '魔理沙(土用)', color: useTableUtils().convertCharacter('Marisa').color},
  CirnoSpring:       {label: 'チルノ(春)', color: useTableUtils().convertCharacter('Cirno').color},
  CirnoSummer:       {label: 'チルノ(夏)', color: useTableUtils().convertCharacter('Cirno').color},
  CirnoAutumn:       {label: 'チルノ(秋)', color: useTableUtils().convertCharacter('Cirno').color},
  CirnoWinter:       {label: 'チルノ(冬)', color: useTableUtils().convertCharacter('Cirno').color},
  Cirno:             {label: 'チルノ(土用)', color: useTableUtils().convertCharacter('Cirno').color},
  AyaSpring:         {label: '文(春)', color: useTableUtils().convertCharacter('Aya').color},
  AyaSummer:         {label: '文(夏)', color: useTableUtils().convertCharacter('Aya').color},
  AyaAutumn:         {label: '文(秋)', color: useTableUtils().convertCharacter('Aya').color},
  AyaWinter:         {label: '文(冬)', color: useTableUtils().convertCharacter('Aya').color},
  Aya:               {label: '文(土用)', color: useTableUtils().convertCharacter('Aya').color},
}

function convertShotType(shot_type_id: string){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

interface Th16Replay{
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
        season_power: string | null,
      }
    ]
  }
}

export function Th16Table(replay: Th16Replay){

  let optional_division=null
  if (replay.replay_meta.replay_type==='spell_card'){
    optional_division={label: convertSpellCard(replay.replay_meta.spell_card_id).ja, color: 'light-blue-darken-3'}
  }

  return{
    game_meta:{
      theme_color: '#176E0E',
      img: {
        thumb: '/images/thumb/th16.png',
        full: '/images/full/th16.png',
        alt: 'th16'
      },
      name: '東方天空璋 〜 Hidden Star in Four Seasons.'
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
          title: '季節ゲージ',
          key: 'season_power',
          sortable: false,
        },
        {
          title: 'グレイズ',
          key: 'graze',
          sortable: false,
        },
      ],
      items: replay.replay_meta.stage_details.map(stage => {

        let bombLabel
        if (stage.bombs !== null && stage.bomb_pieces !== null){
          bombLabel = String(stage.bombs) + ' + (' + String(stage.bomb_pieces) + '/5)'
        }else{
          bombLabel = '-'
        }

        let seasonPowerLabel=null
        if (stage.season_power === null){
          seasonPowerLabel='-'
        }else if (Number(stage.season_power) - 1140 >= 0){
          // レベル6は満タンの状態しか存在しえない
          seasonPowerLabel = 'Lv6'
        }else if (Number(stage.season_power) - 840 >= 0){
          seasonPowerLabel = 'Lv5 + ' + String(Number(stage.season_power) - 840) + '/300'
        }else if (Number(stage.season_power) - 590 >= 0){
          seasonPowerLabel = 'Lv4 + ' + String(Number(stage.season_power) - 590) + '/250'
        }else if (Number(stage.season_power) - 390 >= 0){
          seasonPowerLabel = 'Lv3 + ' + String(Number(stage.season_power) - 390) + '/200'
        }else if (Number(stage.season_power) - 230 >= 0){
          seasonPowerLabel = 'Lv2 + ' + String(Number(stage.season_power) - 230) + '/160'
        }else if (Number(stage.season_power) - 100 >= 0){
          seasonPowerLabel = 'Lv1 + ' + String(Number(stage.season_power) - 100) + '/130'
        }else{
          seasonPowerLabel = 'Lv0 + ' + String(stage.season_power) + '/100'
        }

        return {
          stage: String(stage.stage) !== '7' ? stage.stage : 'Ex',
          score: stage.score !== null ? Number(stage.score).toLocaleString() : '-',
          power: stage.power !== null ? (Number(stage.power) / 100).toFixed(2) : '-',
          lives: stage.lives ?? '-',
          bombs: bombLabel,
          season_power: seasonPowerLabel,
          piv: stage.piv !== null ? Number(stage.piv).toLocaleString() : '-',
          graze: stage.graze !== null ? Number(stage.graze).toLocaleString() : '-',
        }
      })
    }
  }
}