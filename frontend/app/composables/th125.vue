<script setup lang="ts">
  const enemyMap = {
    Sizuha: {
      ja: '秋 静葉',
      en: 'Shizuha Aki'
    },
    Minoriko: {
      ja: '秋 穣子',
      en: 'Minoriko Aki'
    },
    Parsee: {
      ja: '水橋 パルスィ',
      en: 'Parsee Mizuhashi'
    },
    Hina: {
      ja: '鍵山 雛',
      en: 'Hina Kagiyama'
    },
    Kogasa: {
      ja: '多々良 小傘',
      en: 'Kogasa Tatara'
    },
    Kisume: {
      ja: 'キスメ',
      en: 'Kisume'
    },
    Yamame: {
      ja: '黒谷 ヤマメ',
      en: 'Yamame Kurotani'
    },
    Nitori: {
      ja: '河城 にとり',
      en: 'Nitori Kawashiro'
    },
    Momiji: {
      ja: '犬走 椛',
      en: 'Momiji Inubashiri'
    },
    Ichirin: {
      ja: '雲居 一輪＆雲山',
      en: 'Ichirin Kumoi & Unzan'
    },
    Minamitsu: {
      ja: '村紗 水蜜',
      en: 'Minamitsu Murasa'
    },
    Yuugi: {
      ja: '星熊 勇儀',
      en: 'Yuugi Hoshiguma'
    },
    Suika: {
      ja: '伊吹 萃香',
      en: 'Suika Ibuki'
    },
    Syou: {
      ja: '寅丸 星',
      en: 'Syou Toramaru'
    },
    Nazrin: {
      ja: 'ナズーリン',
      en: 'Nazrin'
    },
    Utsuho: {
      ja: '霊烏路 空',
      en: 'Utsuho Reiuji'
    },
    Rin: {
      ja: '火焔猫 燐',
      en: 'Rin Kaenbyou'
    },
    Koishi: {
      ja: '古明地 こいし',
      en: 'Koishi Komeiji'
    },
    Satori: {
      ja: '古明地 さとり',
      en: 'Satori Komeiji'
    },
    Tenshi: {
      ja: '比那名居 天子',
      en: 'Tenshi Hinanai'
    },
    Iku: {
      ja: '永江 衣玖',
      en: 'Iku Nagae'
    },
    Suwako: {
      ja: '洩矢 諏訪子',
      en: 'Suwako Moriya'
    },
    Kanako: {
      ja: '八坂 神奈子',
      en: 'Kanako Yasaka'
    },
    Nue: {
      ja: '封獣 ぬえ',
      en: 'Nue Houjuu'
    },
    Byakuren: {
      ja: '聖 白蓮',
      en: 'Byakuren Hijiri'
    },
    Reimu: {
      ja: '博麗 霊夢',
      en: 'Reimu Hakurei'
    },
    Marisa: {
      ja: '霧雨 魔理沙',
      en: 'Marisa Kirisame'
    },
    Sanae: {
      ja: '東風谷 早苗',
      en: 'Sanae Kochiya'
    },
    Hatate: {
      ja: '姫海棠 はたて',
      en: 'Hatate Himekaidou'
    },
    Aya: {
      ja: '射命丸 文',
      en: 'Aya Shameimaru'
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