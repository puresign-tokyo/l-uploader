// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components' // Vuetifyのコンポーネントをインポート
import * as directives from 'vuetify/directives' // Vuetifyのディレクティブをインポート

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme: {
          dark: false,
          colors: {
            background: '#EEEEEE',
            surface: '#EEEEEE',
            'surface-bright': '#EEEEEE',
            'surface-light': '#CCCCCC',
            'surface-variant': '#424242',
            'on-surface-variant': '#EEEEEE',
            primary: '#1867C0',
            'primary-darken-1': '#1F5592',
            secondary: '#48A9A6',
            'secondary-darken-1': '#018786',
            error: '#B00020',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },


    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  });
  nuxtApp.vueApp.use(vuetify)
})