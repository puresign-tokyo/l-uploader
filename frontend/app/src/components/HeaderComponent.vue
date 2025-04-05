<template>
      <v-navigation-drawer v-model="drawer">
        <v-btn to="/">ホーム</v-btn><br>
        <v-btn to="/NewPost">新規投稿</v-btn><br>
      </v-navigation-drawer>
  
      <v-app-bar>
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