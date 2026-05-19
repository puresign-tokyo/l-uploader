// https://nuxt.com/docs/api/configuration/nuxt-config

import { el } from "vuetify/locale";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: true,
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "東方 リプレイ アップローダ" },
        { property: "og:title", content: "えるろだ" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ja_JP" },
        { property: "og:site_name", content: "えるろだ" },
        { property: "og:description", content: "東方 リプレイ アップローダ" },
        {
          property: "og:image",
          content: "https://l-uploader.puresign.tokyo/images/logo/ogp.png",
        },
        { property: "og:url", content: "https://l-uploader.puresign.tokyo/" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:image",
          content: "https://l-uploader.puresign.tokyo/images/logo/ogp.png",
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/smart-phone-icons/ios/apple-touch-icon-180x180.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ],
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/seo", "@nuxtjs/i18n"],
  site: {
    url: "https://l-uploader.puresign.tokyo",
    name: "えるろだ",
    defaultLocale: "ja",
    indexable: true,
    image: "https://l-uploader.puresign.tokyo/images/logo/ogp.png",
  },
  css: ["vuetify/styles"],
  build: {
    transpile: ["vuetify"],
  },
  plugins: ["@/plugins/vuetify"],
  runtimeConfig: {
    public: {
      frontendHost: "localhost",
      frontendPort: "8080",
      backendHost: "localhost",
      backendPort: "8088",
      httpProtocol: "http",
      postsPerPage: "10",
      usernameLengthLimit: "20",
      uploadCommentLengthLimit: "15",
      filesizeKbLimit: "200",
      deletePasswordLengthLimit: "100",
      optionalTagLengthLimit: "20",
      usernameShareLengthLimit: "20",
      uploadCommentShareLengthLimit: "15",
      recaptchaSitekey: "hogehoge",
      recaptchaEnabled: "false",
    },
  },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "ja",
    baseUrl: "https://l-uploader.puresign.tokyo",
    locales: [
      {
        code: "ja",
        name: "日本語",
        file: "ja.yml",
        iso: "ja-JP",
        language: "ja-JP",
      },
      {
        code: "en",
        name: "English",
        file: "en.yml",
        iso: "en-US",
        language: "en-US",
      },
    ],
    lazy: true,
    langDir: "locales/",
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    bundle: {
      fullInstall: true,
      optimizeTranslationDirective: false,
    },
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    server: {
      allowedHosts: [process.env.NUXT_PUBLIC_FRONTEND_HOST || "localhost"],
      watch: {
        usePolling: true,
      },
      hmr: {
        host: process.env.NUXT_PUBLIC_FRONTEND_HOST || "localhost",
        protocol: "ws",
        port: 80,
      },
    },
  },
});
