<template>
  <v-main>
    <v-container class="py-8">
      <v-card elevation="2" class="pa-4">
        <v-card-title>外部リンク一覧</v-card-title>
        <v-divider class="my-2" />
        <v-list>
          <v-list-item
            v-for="externalLink in externalLinks"
            :key="externalLink.path"
            link
          >
          <a
            :href="externalLink.path"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-list-item-title>{{ externalLink.label }}</v-list-item-title>
          </a>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </v-main>
</template>
  

<script setup>
const externalLinks=[
  {path: "https://wefma.net", label: "製作者のホームページ"},
  {path: "https://alcostg.wefma.net", label: "黄昏酒場攻略ページ"},
  {path: "http://alcostg.amatukami.com/", label: "黄昏酒場公式"}
]
</script>