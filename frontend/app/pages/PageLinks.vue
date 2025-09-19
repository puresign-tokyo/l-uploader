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
const externalLinks = [
  {
    path: "https://blog.l-uploader.puresign.tokyo",
    label: "えるろだ開発ブログ",
  },
  {
    path: "https://wefma.net",
    label: "開発者のホームページ",
  },
  {
    path: "https://info.puresign.tokyo",
    label: "運用者のホームページ",
  },
  {
    path: "http://silentselene.net",
    label: "silentselene.net",
  },
];
</script>
