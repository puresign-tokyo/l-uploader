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

  <v-app-bar color="#D99B01">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

  </v-app-bar>
  
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(false)

  const internalLinks=[
    {path: "/", label: "ホーム"},
    {path: "/NewPost", label: "新規投稿"},
    {path: "/PageLinks", label: "外部リンク一覧"},
    {path: "/TermsServe", label: "利用規約"},
    {path: "/ReleaseNote", label: "リリースノート"}
  ]
</script>