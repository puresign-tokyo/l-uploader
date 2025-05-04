<!-- layouts/error.vue -->
<template>
  <div class="error-page">
    <h1>エラーが発生しました</h1>
    <p>{{ error?.statusCode }} - {{ error?.message }}</p>
    <NuxtLink to="/">トップページへ戻る</NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  error: Object
})
</script>