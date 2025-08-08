<template>
  <v-app>
  <TheHeader/>
  <slot/>
  <ClientOnly>
    <div :style="{ position: 'sticky', top: 'calc(100vh - 80px)', width: '100%' }">
      <TheFooter/>
    </div>
  </ClientOnly>
  </v-app>
</template>


<script setup lang="ts">
  import { ClientOnly } from '#components'
</script>