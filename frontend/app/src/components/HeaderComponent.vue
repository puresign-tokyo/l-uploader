<template>
      <v-navigation-drawer v-model="drawer">
        <v-container>
          <v-btn to="/" block>ホーム</v-btn><br>
          <v-btn to="/NewPost" block>新規投稿</v-btn><br>
          <v-btn to="/TermsServe" block>利用規約</v-btn><br>
        </v-container>
      </v-navigation-drawer>
  
      <v-app-bar color="#D99B01">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  
        <v-app-bar-title>黄昏酒場スコアボード</v-app-bar-title>
      </v-app-bar>
  
      <!-- <v-main>
        
      </v-main> -->
  </template>
  
  <script setup>
    import { ref } from 'vue'
  
    const drawer = ref(false)
  </script>
  
  <!-- <template>
    <header class="header">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/NewPost">New Post</router-link>
      </nav>
    </header>
  </template>
  
  <style scoped>
  .header {
    background-color: #f5f5f5;
    padding: 1rem;
  }
  nav a {
    margin: 0 1rem;
    text-decoration: none;
    color: #333;
  }
  </style> -->