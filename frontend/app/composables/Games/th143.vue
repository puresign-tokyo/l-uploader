<script lang="ts">

  const enemyMap = {
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

  type EnemyId = keyof typeof enemyMap

  export function th125EnemyName(enemyId: string){
    if (!Object.prototype.hasOwnProperty.call(enemyMap, enemyId)) {
      throw new Error(`不正な敵ID: ${enemyId}`);
    }
    const enemyName = enemyMap[enemyId as EnemyId]
  }


</script>