<template>
  <!-- クローラのための情報 -->
  <nav
    style="
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    "
  >
    <a
      v-for="internalLink in internalLinks"
      :key="internalLink.path"
      :href="internalLink.path"
    >
      {{ internalLink.label }}
    </a>
  </nav>

  <ClientOnly>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-container>
        <v-btn
          v-for="internalLink in internalLinks"
          :key="internalLink.path"
          block
          :to="internalLink.path"
          class="mb-2"
        >
          {{ internalLink.label }}
        </v-btn>
        <v-divider class="my-4" />
        <v-btn
          v-for="option in localeOptions"
          :key="option.code"
          block
          :to="switchLocalePath(option.code)"
          class="mb-2"
          variant="outlined"
          :disabled="locale === option.code"
        >
          {{ option.label }}
        </v-btn>
      </v-container>
    </v-navigation-drawer>
  </ClientOnly>

  <v-app-bar :height="THE_HEADER_HEIGHT" color="#8255C8">
    <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer" />
    <img
      src="/images/logo/header_purple_noback.png"
      width="133"
      height="50"
      alt="L-Uploader"
      class="ml-2"
      style="max-width: 133px"
      loading="eager"
      fetchpriority="high"
    />
    <v-btn
      v-for="internalLink in internalLinks"
      :key="internalLink.path"
      :to="internalLink.path"
      class="ml-2 d-none d-md-flex"
    >
      {{ internalLink.label }}
    </v-btn>
    <v-spacer />
    <v-btn
      variant="text"
      class="ml-auto d-flex d-md-none"
      :to="switchLocalePath(locale === 'ja' ? 'en' : 'ja')"
    >
      {{
        locale === "ja"
          ? localeOptions.find((option) => option.code === "en")?.label
          : localeOptions.find((option) => option.code === "ja")?.label
      }}
    </v-btn>
    <v-btn
      v-for="option in localeOptions"
      :key="option.code"
      :to="switchLocalePath(option.code)"
      class="ml-2 d-none d-md-inline-flex"
      size="small"
      :variant="locale === option.code ? 'outlined' : 'text'"
      :disabled="locale === option.code"
    >
      {{ option.label }}
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { computed, ref } from "vue";
import { useHead, useI18n, useLocalePath, useSwitchLocalePath } from "#imports";

const THE_HEADER_HEIGHT = 64;

useHead({
  style: [
    {
      key: "the-header-layout-offset",
      innerHTML:
        ".default-layout .v-main { padding-top: " +
        THE_HEADER_HEIGHT +
        "px !important; }",
    },
  ],
});

const { t: i18nT } = useI18n();
const drawer = ref(false);

const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

const localeOptions = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
];

const baseInternalLinks = [
  { path: "/", labelKey: "pages.index.title" },
  { path: "/NewPost", labelKey: "pages.new_post.title" },
  { path: "/About", labelKey: "pages.about.title" },
  { path: "/TermsServe", labelKey: "pages.terms_serve.title" },
  { path: "/ReleaseNote", labelKey: "pages.release_note.title" },
  { path: "/PageLinks", labelKey: "pages.page_links.title" },
];

const internalLinks = computed(() =>
  baseInternalLinks.map((link) => ({
    path: localePath(link.path),
    label: i18nT(link.labelKey),
  })),
);
</script>
