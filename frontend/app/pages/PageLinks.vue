<template>
  <v-main>
    <v-container class="py-8">
      <v-card elevation="2" class="pa-4">
        <v-card-title>{{
          i18nT("pages.page_links.template.page_links.title")
        }}</v-card-title>
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
import { useI18n } from "#imports";
const { t: i18nT } = useI18n();
const externalLinks = [
  {
    path: "https://blog.l-uploader.puresign.tokyo",
    label: i18nT("pages.page_links.scripts.links.lblog"),
  },
  {
    path: "https://wefma.net",
    label: i18nT("pages.page_links.scripts.links.wefmaika"),
  },
  {
    path: "https://puresign.tokyo",
    label: i18nT("pages.page_links.scripts.links.puresign"),
  },
  {
    path: "http://silentselene.net",
    label: i18nT("pages.page_links.scripts.links.silentselene"),
  },
];
useHead({
  title: i18nT("pages.page_links.title"),
});
</script>
