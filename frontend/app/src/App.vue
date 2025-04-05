<template>
  <v-app id="inspire">
    <HeaderComponent />
    <routerView />
  </v-app>
</template>

<script setup>

  import { onMounted } from 'vue';
  import axios from 'axios';

  import HeaderComponent from './components/HeaderComponent.vue'

  onMounted(async () => {
  try {
    const response = await axios.get('http://board02.alcostg.web.wefma.net:5002/replays/8');
    console.log('レスポンスデータ:', response.data);
  } catch (error) {
    console.error('エラー:', error);
  }
  });
</script>
