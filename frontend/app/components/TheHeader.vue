<template>

  <!-- クローラのための情報 -->
  <nav style="
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  ">
    <a
      v-for="internalLink in internalLinks"
      :key="internalLink.path"
      :href="internalLink.path"
    >
      {{internalLink.label}}
    </a>
  </nav>

  <ClientOnly>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-container>
        <v-btn
         v-for="internalLink in internalLinks" :key="internalLink.path"
         block
         :to="internalLink.path"
         class="mb-2"
        >
          {{internalLink.label}}
        </v-btn>
      </v-container>
    </v-navigation-drawer>
  </ClientOnly>

  <v-app-bar color="#666699">
    <v-app-bar-nav-icon
      v-if="display.smAndDown.value"
      @click="drawer = !drawer"
    />
    <v-img
      src="/images/logo.png"
      height="50"
      class="ml-2"
      style="max-width: 200px;"
    />
    <v-btn
      v-if="!display.smAndDown.value"
      v-for="internalLink in internalLinks" :key="internalLink.path"
      :to="internalLink.path"
      class="ml-2"
    >
      {{internalLink.label}}
    </v-btn>

  </v-app-bar>
  
</template>

<script setup>
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'
  const display=useDisplay()

  const drawer = ref(false)

  const internalLinks=[
    {path: "/", label: "ホーム"},
    {path: "/NewPost", label: "新規投稿"},
    {path: "/TermsServe", label: "利用規約"},
    {path: "/ReleaseNote", label: "リリースノート"},
    {path: "/Credits", label: "スタッフ紹介"},
    {path: "/PageLinks", label: "外部リンク一覧"},
  ]

  watch(display.smAndDown, (isSmall) => {
    if (!isSmall) {
      drawer.value = false
    }
  })
</script>