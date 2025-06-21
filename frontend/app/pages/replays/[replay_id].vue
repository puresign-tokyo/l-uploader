<template>
  <v-main>
    <v-container>
      <v-card v-if="loading">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-card>

      <v-card v-else-if="errorResponse">
        <v-alert type="error" color="red darken-1" icon="mdi-alert-circle">
          データの取得中にエラーが発生しました。<br>
          リロードするか、後でもう一度お試しください。
        </v-alert>
      </v-card>

      <v-card v-else
        :title="`${replay.filename}`"
      >

      </v-card>
      <h1>{{ replay.filename }}</h1>
    </v-container>
  </v-main>
</template>

<script setup>
import Th06Detail from '~/components/Games/Th06/Th06Detail.vue'

const route = useRoute()
const loading = ref(true)
const errorResponse=ref(false)
const replay=ref<{filename: string, }>({filename:""})

const detailComponents = {
  th06: Th06Detail,
}

const getComponentForReplayDetail = (gameId)=>detailComponents[gameId] || Th06Detail

await useFetch(`${useRuntimeConfig().public.backend_url}/replays/${route.params.replay_id}`, {
  server: false,
  onResponse({ response }) {
    replay.value = response._data
    loading.value = false
  },
  onResponseError({ error }) {
    console.error(error)
    errorResponse.value=true
    loading.value = false
  },
})
</script>