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

  <v-app-bar color="#8255C8">
    <v-app-bar-nav-icon
      v-if="display.smAndDown.value"
      @click="drawer = !drawer"
    />
    <v-img
      src="/images/logo/header_purple_noback.png"
      height="50"
      class="ml-2"
      style="max-width: 133px"
    />
    <v-btn
      v-if="!display.smAndDown.value"
      v-for="internalLink in internalLinks"
      :key="internalLink.path"
      :to="internalLink.path"
      class="ml-2"
    >
      {{ internalLink.label }}
    </v-btn>
    <v-spacer />
    <v-btn
      v-if="display.smAndDown.value"
      variant="text"
      class="ml-auto"
      :to="switchLocalePath(locale === 'ja' ? 'en' : 'ja')"
    >
      {{
        locale === "ja"
          ? localeOptions.find((option) => option.code === "en")?.label
          : localeOptions.find((option) => option.code === "ja")?.label
      }}
    </v-btn>
    <template v-else>
      <v-btn
        v-for="option in localeOptions"
        :key="option.code"
        :to="switchLocalePath(option.code)"
        class="ml-2"
        size="small"
        :variant="locale === option.code ? 'outlined' : 'text'"
        :disabled="locale === option.code"
      >
        {{ option.label }}
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useI18n, useLocalePath, useSwitchLocalePath } from "#imports";

const { t: i18nT } = useI18n();
const display = useDisplay();
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
  }))
);

watch(display.smAndDown, (isSmall) => {
  if (!isSmall) {
    drawer.value = false;
  }
});
</script>
