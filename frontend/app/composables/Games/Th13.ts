import { stringifyQuery } from "vue-router"
import { useTableUtils } from "./TableUtils"
import Replay_id from "~/pages/replays/[replay_id].vue"
import { compile } from "vue"

const spellCardMap: Record<string, {ja: string, en: string}>={
  0 :  {ja: "符牒「死蝶の舞」", en:'Symbol "Dance of the Dead Butterflies"'},
  1 :  {ja: "符牒「死蝶の舞」", en:'Symbol "Dance of the Dead Butterflies"'},
  2 :  {ja: "符牒「死蝶の舞　- 桜花 -」", en:'Symbol "Dance of the Dead Butterflies - Cherry Blossoms -"'},
  3 :  {ja: "符牒「死蝶の舞　- 桜花 -」", en:'Symbol "Dance of the Dead Butterflies - Cherry Blossoms -"'},
  4 :  {ja: "幽蝶「ゴーストスポット」", en:'Ghostly Butterfly "Ghost Spot"'},
  5 :  {ja: "幽蝶「ゴーストスポット」", en:'Ghostly Butterfly "Ghost Spot"'},
  6 :  {ja: "幽蝶「ゴーストスポット　- 桜花 -」", en:'Ghostly Butterfly "Ghost Spot - Cherry Blossoms -"'},
  7 :  {ja: "幽蝶「ゴーストスポット　- 桜花 -」", en:'Ghostly Butterfly "Ghost Spot - Cherry Blossoms -"'},
  8 :  {ja: "冥符「常夜桜」", en:'Nether Sign "Endless Evening Cherry Blossoms"'},
  9 :  {ja: "冥符「常夜桜」", en:'Nether Sign "Endless Evening Cherry Blossoms"'},
  10:  {ja: "冥符「常夜桜」", en:'Nether Sign "Endless Evening Cherry Blossoms"'},
  11:  {ja: "冥符「常夜桜」", en:'Nether Sign "Endless Evening Cherry Blossoms"'},
  12:  {ja: "桜符「西行桜吹雪」", en:'Cherry Blossom Sign "Saigyou Cherry Blossom Blizzard"'},
  13:  {ja: "桜符「西行桜吹雪」", en:'Cherry Blossom Sign "Saigyou Cherry Blossom Blizzard"'},
  14:  {ja: "響符「マウンテンエコー」", en:'Echo Sign "Mountain Echo"'},
  15:  {ja: "響符「マウンテンエコー」", en:'Echo Sign "Mountain Echo"'},
  16:  {ja: "響符「マウンテンエコースクランブル」", en:'Echo Sign "Mountain Echo Scramble"'},
  17:  {ja: "響符「マウンテンエコースクランブル」", en:'Echo Sign "Mountain Echo Scramble"'},
  18:  {ja: "響符「パワーレゾナンス」", en:'Echo Sign "Power Resonance"'},
  19:  {ja: "響符「パワーレゾナンス」", en:'Echo Sign "Power Resonance"'},
  20:  {ja: "響符「パワーレゾナンス」", en:'Echo Sign "Power Resonance"'},
  21:  {ja: "響符「パワーレゾナンス」", en:'Echo Sign "Power Resonance"'},
  22:  {ja: "山彦「ロングレンジエコー」", en:'Mountain Echo "Long-Range Echo"'},
  23:  {ja: "山彦「ロングレンジエコー」", en:'Mountain Echo "Long-Range Echo"'},
  24:  {ja: "山彦「アンプリファイエコー」", en:'Mountain Echo "Amplify Echo"'},
  25:  {ja: "山彦「アンプリファイエコー」", en:'Mountain Echo "Amplify Echo"'},
  26:  {ja: "大声「チャージドクライ」", en:'Great Voice "Charged Cry"'},
  27:  {ja: "大声「チャージドクライ」", en:'Great Voice "Charged Cry"'},
  28:  {ja: "大声「チャージドヤッホー」", en:'Great Voice "Charged Yahoo!"'},
  29:  {ja: "大声「チャージドヤッホー」", en:'Great Voice "Charged Yahoo!"'},
  30:  {ja: "虹符「アンブレラサイクロン」", en:'Rainbow Sign "Umbrella Cyclone"'},
  31:  {ja: "虹符「アンブレラサイクロン」", en:'Rainbow Sign "Umbrella Cyclone"'},
  32:  {ja: "回復「ヒールバイデザイア」", en:'Recovery "Heal By Desire"'},
  33:  {ja: "回復「ヒールバイデザイア」", en:'Recovery "Heal By Desire"'},
  34:  {ja: "回復「ヒールバイデザイア」", en:'Recovery "Heal By Desire"'},
  35:  {ja: "回復「ヒールバイデザイア」", en:'Recovery "Heal By Desire"'},
  36:  {ja: "毒爪「ポイズンレイズ」", en:'Poison Nail "Poison Raze"'},
  37:  {ja: "毒爪「ポイズンレイズ」", en:'Poison Nail "Poison Raze"'},
  38:  {ja: "毒爪「ポイズンマーダー」", en:'Poison Nail "Poison Murder"'},
  39:  {ja: "毒爪「ポイズンマーダー」", en:'Poison Nail "Poison Murder"'},
  40:  {ja: "欲符「稼欲霊招来」", en:'Desire Sign "Saved Up Desire Spirit Invitation"'},
  41:  {ja: "欲符「稼欲霊招来」", en:'Desire Sign "Saved Up Desire Spirit Invitation"'},
  42:  {ja: "欲霊「スコアデザイアイーター」", en:'Desire Spirit "Score Desire Eater"'},
  43:  {ja: "欲霊「スコアデザイアイーター」", en:'Desire Spirit "Score Desire Eater"'},
  44:  {ja: "邪符「ヤンシャオグイ」", en:'Evil Sign "Yǎng Xiǎoguǐ"'},
  45:  {ja: "邪符「グーフンイエグイ」", en:'Evil Sign "Gūhún Yěguǐ"'},
  46:  {ja: "邪符「グーフンイエグイ」", en:'Evil Sign "Gūhún Yěguǐ"'},
  47:  {ja: "入魔「ゾウフォルゥモォ」", en:'Demonify "Zǒuhuǒ Rùmó"'},
  48:  {ja: "入魔「ゾウフォルゥモォ」", en:'Demonify "Zǒuhuǒ Rùmó"'},
  49:  {ja: "入魔「ゾウフォルゥモォ」", en:'Demonify "Zǒuhuǒ Rùmó"'},
  50:  {ja: "入魔「ゾウフォルゥモォ」", en:'Demonify "Zǒuhuǒ Rùmó"'},
  51:  {ja: "降霊「死人タンキー」", en:'Possession "Corpse Tóngjī"'},
  52:  {ja: "降霊「死人タンキー」", en:'Possession "Corpse Tóngjī"'},
  53:  {ja: "通霊「トンリン芳香」", en:'Spirit Link "Tōnglíng Yoshika"'},
  54:  {ja: "通霊「トンリン芳香」", en:'Spirit Link "Tōnglíng Yoshika"'},
  55:  {ja: "道符「タオ胎動」", en:'Taoist Sign "Tao Fetal Movement"'},
  56:  {ja: "道符「タオ胎動」", en:'Taoist Sign "Tao Fetal Movement"'},
  57:  {ja: "道符「タオ胎動」", en:'Taoist Sign "Tao Fetal Movement"'},
  58:  {ja: "道符「タオ胎動」", en:'Taoist Sign "Tao Fetal Movement"'},
  59:  {ja: "雷矢「ガゴウジサイクロン」", en:'Thunder Arrow "Gagouji\'s Cyclone"'},
  60:  {ja: "雷矢「ガゴウジサイクロン」", en:'Thunder Arrow "Gagouji\'s Cyclone"'},
  61:  {ja: "雷矢「ガゴウジトルネード」", en:'Thunder Arrow "Gagouji\'s Tornado"'},
  62:  {ja: "天符「雨の磐舟」", en:'Heaven Sign "Rainy Iwafune"'},
  63:  {ja: "天符「雨の磐舟」", en:'Heaven Sign "Rainy Iwafune"'},
  64:  {ja: "天符「天の磐舟よ天へ昇れ」", en:'Heaven Sign "Ame-no-Iwafune, Ascend to Heaven"'},
  65:  {ja: "天符「天の磐舟よ天へ昇れ」", en:'Heaven Sign "Ame-no-Iwafune, Ascend to Heaven"'},
  66:  {ja: "投皿「物部の八十平瓮」", en:'Throwing Dishes "Mononobe\'s Eighty Saké Cups"'},
  67:  {ja: "投皿「物部の八十平瓮」", en:'Throwing Dishes "Mononobe\'s Eighty Saké Cups"'},
  68:  {ja: "投皿「物部の八十平瓮」", en:'Throwing Dishes "Mononobe\'s Eighty Saké Cups"'},
  69:  {ja: "投皿「物部の八十平瓮」", en:'Throwing Dishes "Mononobe\'s Eighty Saké Cups"'},
  70:  {ja: "炎符「廃仏の炎風」", en:'Blaze Sign "Blazing Winds of Haibutsu"'},
  71:  {ja: "炎符「廃仏の炎風」", en:'Blaze Sign "Blazing Winds of Haibutsu"'},
  72:  {ja: "炎符「桜井寺炎上」", en:'Blaze Sign "Sakurai-ji in Flames"'},
  73:  {ja: "炎符「桜井寺炎上」", en:'Blaze Sign "Sakurai-ji in Flames"'},
  74:  {ja: "聖童女「大物忌正餐」", en:'Saint Girl "Oomonoimi\'s Dinner"'},
  75:  {ja: "聖童女「大物忌正餐」", en:'Saint Girl "Oomonoimi\'s Dinner"'},
  76:  {ja: "聖童女「大物忌正餐」", en:'Saint Girl "Oomonoimi\'s Dinner"'},
  77:  {ja: "聖童女「大物忌正餐」", en:'Saint Girl "Oomonoimi\'s Dinner"'},
  78:  {ja: "名誉「十二階の色彩」", en:'Honor "Colors of Twelve Levels"'},
  79:  {ja: "名誉「十二階の色彩」", en:'Honor "Colors of Twelve Levels"'},
  80:  {ja: "名誉「十二階の冠位」", en:'Honor "Ranks of Twelve Levels"'},
  81:  {ja: "名誉「十二階の冠位」", en:'Honor "Ranks of Twelve Levels"'},
  82:  {ja: "仙符「日出ずる処の道士」", en:'Hermit Sign "Taoist of the Land of the Rising Sun"'},
  83:  {ja: "仙符「日出ずる処の道士」", en:'Hermit Sign "Taoist of the Land of the Rising Sun"'},
  84:  {ja: "仙符「日出ずる処の天子」", en:'Hermit Sign "Emperor of the Land of the Rising Sun"'},
  85:  {ja: "仙符「日出ずる処の天子」", en:'Hermit Sign "Emperor of the Land of the Rising Sun"'},
  86:  {ja: "召喚「豪族乱舞」", en:'Summon "Royal Clan\'s Chaotic Dance"'},
  87:  {ja: "召喚「豪族乱舞」", en:'Summon "Royal Clan\'s Chaotic Dance"'},
  88:  {ja: "召喚「豪族乱舞」", en:'Summon "Royal Clan\'s Chaotic Dance"'},
  89:  {ja: "召喚「豪族乱舞」", en:'Summon "Royal Clan\'s Chaotic Dance"'},
  90:  {ja: "秘宝「斑鳩寺の天球儀」", en:'Secret Treasure "Armillary Sphere of Ikaruga-dera"'},
  91:  {ja: "秘宝「斑鳩寺の天球儀」", en:'Secret Treasure "Armillary Sphere of Ikaruga-dera"'},
  92:  {ja: "秘宝「斑鳩寺の天球儀」", en:'Secret Treasure "Armillary Sphere of Ikaruga-dera"'},
  93:  {ja: "秘宝「聖徳太子のオーパーツ」", en:'Secret Treasure "Prince Shotoku\'s Out-of-Place Artifact"'},
  94:  {ja: "光符「救世観音の光後光」", en:'Light Sign "Halo of the Guse Kannon"'},
  95:  {ja: "光符「救世観音の光後光」", en:'Light Sign "Halo of the Guse Kannon"'},
  96:  {ja: "光符「グセフラッシュ」", en:'Light Sign "Guse Flash"'},
  97:  {ja: "光符「グセフラッシュ」", en:'Light Sign "Guse Flash"'},
  98:  {ja: "眼光「十七条のレーザー」", en:'Discernment "Lasers of Seventeen Articles"'},
  99: {ja: "眼光「十七条のレーザー」", en:'Discernment "Lasers of Seventeen Articles"'},
  100: {ja: "神光「逆らう事なきを宗とせよ」", en:'Divine Light "Honor the Avoidance of Defiance"'},
  101: {ja: "神光「逆らう事なきを宗とせよ」", en:'Divine Light "Honor the Avoidance of Defiance"'},
  102: {ja: "「星降る神霊廟」", en:'"Falling Stars on Divine Spirit Mausoleum"'},
  103: {ja: "「星降る神霊廟」", en:'"Falling Stars on Divine Spirit Mausoleum"'},
  104: {ja: "「生まれたての神霊」", en:'"Newborn Divine Spirits"'},
  105: {ja: "「生まれたての神霊」", en:'"Newborn Divine Spirits"'},
  106: {ja: "アンノウン「軌道不明の鬼火」", en:'Unknown "Will-o\'-wisps in Unknown Orbit"'},
  107: {ja: "アンノウン「姿態不明の空魚」", en:'Unknown "Skyfish with Unknown Shape"'},
  108: {ja: "アンノウン「原理不明の妖怪玉」", en:'Unknown "Youkai Orb of Unknown Mechanics"'},
  109: {ja: "壱番勝負「霊長化弾幕変化」", en:'First Duel "Primate Danmaku Transformation"'},
  110: {ja: "弐番勝負「肉食化弾幕変化」", en:'Second Duel "Carnivorous Danmaku Transformation"'},
  111: {ja: "参番勝負「延羽化弾幕変化」", en:'Third Duel "Avian Danmaku Transformation"'},
  112: {ja: "四番勝負「両生化弾幕変化」", en:'Fourth Duel "Amphibian Danmaku Transformation"'},
  113: {ja: "伍番勝負「鳥獣戯画」", en:'Fifth Duel "Scrolls of Frolicking Animals"'},
  114: {ja: "六番勝負「狸の化け学校」", en:'Sixth Duel "Tanuki\'s Monstrous School"'},
  115: {ja: "七番勝負「野生の離島」", en:'Seventh Duel "Wild Deserted Island"'},
  116: {ja: "変化「まぬけ巫女の偽調伏」", en:'Transformation "Pseudo-Exorcism of the Stupid Shrine Maiden"'},
  117: {ja: "「マミゾウ化弾幕十変化」", en:'"Mamizou Danmaku in Ten Transformations"'},
  118: {ja: "狢符「満月のポンポコリン」", en:'Raccoon Sign "Full Moon Pompokolin"'},
  119: {ja: "桜符「桜吹雪地獄」", en:'Cherry Blossom Sign "Cherry Blossom Blizzard Hell"'},
  120: {ja: "山彦「ヤマビコの本領発揮エコー」", en:'Mountain Echo "Yamabiko\'s Specialty Echo Demonstration"'},
  121: {ja: "毒爪「死なない殺人鬼」", en:'Poison Nail "Undead Murderer"'},
  122: {ja: "道符「ＴＡＯ胎動　〜道〜」", en:'Taoist Sign "TAO Fetal Movement ~Dao~"'},
  123: {ja: "怨霊「入鹿の雷」", en:'Vengeful Spirit "Iruka\'s Thunder"'},
  124: {ja: "聖童女「太陽神の贄」", en:'Saint Girl "Sun Goddess\'s Sacrifice"'},
  125: {ja: "「神霊大宇宙」", en:'"Divine Spirits\' Universe"'},
  126: {ja: "「ワイルドカーペット」", en:'"Wild Carpet"'},
}
function convertSpellCard(spell_card_id: string){
  return spellCardMap[spell_card_id] ?? {ja: "不明", en: "Unknown"}
}

const shotTypeMap: Record<string, {label: string, color: string}> = {
  Reimu:       useTableUtils().convertCharacter('Reimu'),
  Marisa:      useTableUtils().convertCharacter('Marisa'),
  Sanae:       useTableUtils().convertCharacter('Sanae'),
  Youmu:       useTableUtils().convertCharacter('Youmu')
}

function convertShotType(shot_type_id: string){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

interface Th13Replay{
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
        trance: string | null,
        extends: string | null,
      }
    ]
  }
}

export function Th13Table(replay: Th13Replay){

  let optional_division=null
  if (replay.replay_meta.replay_type==='spell_card'){
    optional_division={label: convertSpellCard(replay.replay_meta.spell_card_id).ja, color: 'light-blue-darken-3'}
  }

  let difficulty
  if (Number(replay.replay_meta.difficulty) === 5){
    difficulty={label: 'OverDrive', color: 'red accent-4'}
  }else{
    difficulty=useTableUtils().convertDifficulty(replay.replay_meta.difficulty)
  }
  return{
    game_meta:{
      theme_color: '#4A808C',
      img: {img: '/images/th13.png', alt: 'th13'},
      name: '東方神霊廟 〜 Ten Desires.'
    },
    filename: replay.filename,
    uploaded_at: new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user_name: replay.user_name,
    total_score: Number(replay.replay_meta.total_score).toLocaleString(),
    replay_name: replay.replay_meta.name,
    slowdown: (Number(replay.replay_meta.slowdown)).toFixed(2) + '%',
    timestamp: new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'}),
    difficulty: difficulty,
    shot_type: convertShotType(replay.replay_meta.shot_type),
    optional_division: optional_division,
    optional_tag: replay.optional_tag,
    upload_comment: replay.upload_comment,
    replay_type: useTableUtils().convertReplayType(replay.replay_meta.replay_type),
    category: useTableUtils().convertCategory(replay.category),
    replay_id: replay.replay_id
  }
}