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
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/seo"],
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
    backend_url: (() => {
      const protocol = process.env.NUXT_PUBLIC_HTTP_PROTOCOL || "http";
      const host = process.env.NUXT_PUBLIC_BACKEND_HOST || "localhost";
      const port =
        process.env.NUXT_PUBLIC_BACKEND_PORT ||
        (protocol === "https" ? "443" : "80");

      const omitPort =
        (protocol === "http" && port === "80") ||
        (protocol === "https" && port === "443");
      return `${protocol}://${host}${omitPort ? "" : `:${port}`}`;
    })(),
    pagination_size: (() => {
      return process.env.NUXT_PUBLIC_PAGINATION_LIMIT;
    })(),
    public: {
      backend_url: (() => {
        const protocol = process.env.NUXT_PUBLIC_HTTP_PROTOCOL || "http";
        const host = process.env.NUXT_PUBLIC_BACKEND_HOST || "localhost";
        const port =
          process.env.NUXT_PUBLIC_BACKEND_PORT ||
          (protocol === "https" ? "443" : "80");

        const omitPort =
          (protocol === "http" && port === "80") ||
          (protocol === "https" && port === "443");
        return `${protocol}://${host}${omitPort ? "" : `:${port}`}`;
      })(),
      pagination_size: (() => {
        return process.env.NUXT_PUBLIC_POSTS_PER_PAGE;
      })(),
      username_length_limit: (() => {
        return process.env.NUXT_PUBLIC_USERNAME_LENGTH_LIMIT;
      })(),
      upload_comment_length_limit: (() => {
        return process.env.NUXT_PUBLIC_UPLOAD_COMMENT_LENGTH_LIMIT;
      })(),
      filesize_kb_limit: (() => {
        return process.env.NUXT_PUBLIC_FILESIZE_KB_LIMIT;
      })(),
      delete_password_length_limit: (() => {
        return process.env.NUXT_PUBLIC_DELETE_PASSWORD_LENGTH_LIMIT;
      })(),
      optional_tag_length_limit: (() => {
        return process.env.NUXT_PUBLIC_OPTIONAL_TAG_LENGTH_LIMIT;
      })(),
      recaptcha_sitekey: (() => {
        return process.env.NUXT_PUBLIC_RECAPTCHA_SITEKEY;
      })(),
      recaptcha_enabled: (() => {
        if (process.env.NUXT_PUBLIC_RECAPTCHA_ENABLED === "True") {
          return true;
        } else {
          return false;
        }
      })(),
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
