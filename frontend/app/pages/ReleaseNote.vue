<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-6">リリースノート</h1>

    <v-list two-line>
      <template v-for="(release, index) in releases" :key="index">
        <v-list-subheader>
          {{ release.version }}（{{ release.date }}）
        </v-list-subheader>

        <v-list-item
          v-for="(item, i) in release.changes"
          :key="`${index}-${i}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-4"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>
<script setup>
  const releases=[
    {
      version: "0.9.0",
      date: "2025-04-19",
      changes: [
        "黄昏酒場スコアボード公開"
      ]
    },
    {
      version: "1.0.0",
      date: "2025-05-04",
      changes: [
        "ページの表示形式をSPAからSSRに変えることでGoogleなどの検索エンジンに載りやすくした",
        "外部リンク集とリリースノートページの追加",
        "その他大幅なフロントエンドの変更"
      ]
    }
  ]
</script>