// https://nuxt.com/docs/api/configuration/nuxt-config

import { el } from "vuetify/locale"

// const backend_url = `${process.env.VITE_APP_HTTP_PROTOCOL}://${process.env.VITE_APP_BACKEND_HOST}:${process.env.VITE_APP_BACKEND_PORT}`
// console.log(process.env.VITE_APP_HTTP_PROTOCOL)
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
  ],
  css: [
    "vuetify/styles"
  ],
  build: {
    transpile: ["vuetify"]
  },
  plugins: ['@/plugins/vuetify'],
  runtimeConfig: {
    backend_url: (() => {
      const protocol = process.env.NUXT_PUBLIC_HTTP_PROTOCOL || 'http'
      const host = process.env.NUXT_PUBLIC_BACKEND_HOST || 'localhost'
      const port = process.env.NUXT_PUBLIC_BACKEND_PORT || (protocol === 'https' ? '443' : '80')

      const omitPort = (protocol === 'http' && port === '80') || (protocol === 'https' && port === '443')
      return `${protocol}://${host}${omitPort ? '' : `:${port}`}`
    })(),
    pagination_size: (() => {
        return process.env.NUXT_PUBLIC_PAGINATION_LIMIT
    })(),
    public: {
      backend_url: (() => {
        const protocol = process.env.NUXT_PUBLIC_HTTP_PROTOCOL || 'http'
        const host = process.env.NUXT_PUBLIC_BACKEND_HOST || 'localhost'
        const port = process.env.NUXT_PUBLIC_BACKEND_PORT || (protocol === 'https' ? '443' : '80')

        const omitPort = (protocol === 'http' && port === '80') || (protocol === 'https' && port === '443')
        return `${protocol}://${host}${omitPort ? '' : `:${port}`}`
      })(),
      pagination_size: (() => {
        return process.env.NUXT_PUBLIC_PAGINATION_LIMIT
      })(),
      username_length_limit: (() => {
        return process.env.NUXT_PUBLIC_USERNAME_LENGTH_LIMIT
      })(),
      upload_comment_length_limit: (() => {
        return process.env.NUXT_PUBLIC_UPLOAD_COMMENT_LENGTH_LIMIT
      })(),
      filesize_kb_limit: (() => {
        return process.env.NUXT_PUBLIC_FILESIZE_KB_LIMIT
      })(),
      delete_password_length_limit: (() => {
        return process.env.NUXT_PUBLIC_DELETE_PASSWORD_LENGTH_LIMIT
      })(),
      optional_tag_length_limit: (() => {
        return process.env.NUXT_PUBLIC_OPTIONAL_TAG_LENGTH_LIMIT
      })(),
      recaptcha_sitekey: (() => {
        return process.env.NUXT_PUBLIC_RECAPTCHA_SITEKEY
      })(),
      recaptcha_enabled: (() => {
        if (process.env.NUXT_PUBLIC_RECAPTCHA_ENABLED==="True"){
          return true
        }else{
          return false
        }
      })(),
    }
  },
  sitemap: <any>{
    hostname: (() => {
      const protocol = process.env.NUXT_PUBLIC_HTTP_PROTOCOL || 'http'
      const host = process.env.NUXT_PUBLIC_FRONTEND_HOST || 'localhost'
      const port = process.env.NUXT_PUBLIC_FRONTEND_PORT || (protocol === 'https' ? '443' : '80')

      const omitPort = (protocol === 'http' && port === '80') || (protocol === 'https' && port === '443')
      return `${protocol}://${host}${omitPort ? '' : `:${port}`}`
    })(),
    urls: [
      {
        loc: '/',
        lastmod: '2025-05-04',
        priority: 0.5,
        changefreq: 'weekly'
      },
      {
        loc: '/NewPost',
        lastmod: '2025-05-04',
        priority: 0.5,
        changefreq: 'weekly'
      },
      {
        loc: '/PageLinks',
        lastmod: '2025-05-04',
        priority: 0.5,
        changefreq: 'weekly'
      },
      {
        loc: '/ReleaseNote',
        lastmod: '2025-05-04',
        priority: 0.5,
        changefreq: 'weekly'
      },
      {
        loc: '/TermsServe',
        lastmod: '2025-05-04',
        priority: 0.5,
        changefreq: 'weekly'
      },
    ]
  },
  vite: {
    define: {
      "process.env.DEBUG": false
    },
    server: {
      allowedHosts: [
        process.env.NUXT_PUBLIC_FRONTEND_HOST || "localhost"
      ],
      watch: {
        usePolling: true
      },
      hmr: {
        host: process.env.NUXT_PUBLIC_FRONTEND_HOST || "localhost",
        protocol: 'ws',
        port: 80
      }

    }
  }
})
