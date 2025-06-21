<template>
  <v-card
  class="d-flex my-8"
  elevation="4"
  style="border-left: 8px solid #AAAAAA; align-items: stretch; min-height: 170px;"
  replay
>
  <div style="padding: 10px 0 10px 10px; flex-shrink: 0;">
    <v-img
      src="/images/error.png"
      alt="error"
      width="100"
      height="150"
      cover
      class="rounded-lg elevation-2"
      style="opacity: 0.6;"
    />
  </div>

    <!-- テキスト + アイコン -->
  <v-col class="pa-2 d-flex justify-space-between align-start" style="flex: 1 1 auto;">
    <v-card-text class="pa-0" elevation="0">
      <v-row no-gutters>
        <v-col cols="12">
          <div class="text-h6 font-weight-bold">
            {{ replay.filename ? replay.filename : '-' }}
            <span class="text-caption text--secondary ml-2">
              {{ replay.uploaded_at ? new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-' }}
            </span>
            <span class="text-caption text--secondary ml-2">
              <v-icon small class="mr-1" title="ユーザ名">mdi-account</v-icon>
              {{ replay.user_name ? replay.user_name : '-' }}
            </span>
          </div>
        </v-col>
        <v-col cols="12">
          <span class="text-h5 font-weight-bold">
            不明なリプレイです
          </span>
        </v-col>
      </v-row>
    </v-card-text>


    <!-- アイコン群（右上） -->
    <div class="d-flex align-center" style="position: absolute; bottom: 8px; right: 12px; gap: 8px;">
      <v-icon
        icon="mdi-information-outline"
        class="text-disabled"
        variant="tonal"
        title="詳細情報"
      />

      <v-icon
        icon="mdi-trash-can-outline"
        class="text-disabled"
        variant="tonal"
        color="error"
        title="削除"
      />

      <v-icon
        icon="mdi-share-variant"
        class="text-disabled"
        variant="tonal"
        title="シェア"
      />

      <v-icon
        icon="mdi-tray-arrow-down"
        class="text-disabled"
        variant="tonal"
        title="ダウンロード"
      />

    </div>

  </v-col>
</v-card>

</template>
<script setup>
defineProps({
  replay: Object
})
defineEmits({
  showDetail: null,
  confirmDelete: null,
  confirmShare: null
})
</script>