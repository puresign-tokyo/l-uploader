<template>

<v-card
  class="d-flex my-8"
  elevation="4"
  style="border-left: 8px solid #993333; align-items: stretch; min-height: 170px;min-width: 0;"
  replay
>
  <!-- 画像 -->
  <div class="hidden-sm-and-down" style="padding: 10px 0 10px 10px; flex-shrink: 0;min-width: 0;">
    <v-img
      src="/images/th06.png"
      alt="th06"
      width="100"
      height="150"
      cover
      class="rounded-lg elevation-2"
      style="opacity: 0.6;"
    />
  </div>

  <!-- テキスト + アイコン -->
  <v-col class="pa-2 d-flex justify-space-between align-start" style="flex: 1 1 auto;min-width: 0;">
    <v-card-text class="pa-0" elevation="0" style="min-width: 0;">
      <v-row no-gutters style="min-width: 0;">

        <!-- ファイル名 + 投稿日 + ユーザ名 -->
        <v-col cols="12" md="3">
          <div class="text-h6 font-weight-bold">
            {{ replay.filename }}
          </div>
        </v-col>
        <v-col cols="6" md="3">
            <span class="text-caption text--secondary ml-2">
              {{ new Date(replay.uploaded_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}
            </span>
        </v-col>
        <v-col cols="6" md="6">
            <span class="text-caption text--secondary ml-2">
              <v-icon small class="mr-1" title="ユーザ名">mdi-account</v-icon>
              {{ replay.user_name }}
            </span>
          
        </v-col>

        <!-- ゲーム名 -->
        <v-col cols="12" class="d-flex align-center">
          <v-icon small class="mr-1" title="ゲーム名">mdi-controller</v-icon>
          <strong>東方紅魔郷 〜 the Embodiment of Scarlet Devil.</strong>
        </v-col>


        <!-- スコア (スマホでは改行) + リプレイ名 + 処理落ち率 + リプレイ作成日 -->
        <v-col cols="12" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="スコア">mdi-trophy</v-icon>
          <span class="text-h5 font-weight-bold">
          {{ replay.replay_meta.total_score ? Number(replay.replay_meta.total_score).toLocaleString() : '-' }}
          </span>
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="リプレイ名">mdi-badge-account-outline</v-icon>
          {{ replay.replay_meta.name }}
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="処理落ち率">mdi-play-speed</v-icon>
          処理落ち率: {{ isNaN(Number(replay.replay_meta.slowdown)) ? 'N/A' : (Number(replay.replay_meta.slowdown)).toFixed(2) + '%' }}
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="リプレイ作成日">mdi-calendar-clock</v-icon>
          <!-- 年月日の情報しか入っていない -->
          {{ new Date(replay.replay_meta.timestamp).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit'})  }}
        </v-col>


        <!-- 難易度 + 機体 (スマホでは改行) + オプションタグ -->
        <v-col cols="12" md="9" class="d-flex align-center">
          <v-icon small class="mr-1" title="難易度 機体">mdi-flag</v-icon>
            <div class="d-flex" style="gap:8px;">
            <v-chip :color="convertDifficulty(replay.replay_meta.difficulty).color" text-color="white" small>
              {{ convertDifficulty(replay.replay_meta.difficulty).label }}
            </v-chip>

            <v-chip
              :style="{
                border: `2px solid ${convertShotType(replay.replay_meta.shot_type).color}`,
                fontWeight: 500,
              }"
              variant="outlined"
            >
              {{ convertShotType(replay.replay_meta.shot_type).label }}
            </v-chip>
            </div>
        </v-col>

        <v-col cols="12" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="オプションタグ">mdi-tag-outline</v-icon>
          <v-chip 
            color="grey"
            small
          >
            {{ replay.optional_tag }}
          </v-chip>
        </v-col>


        <!-- コメント -->
        <!-- どうやっても横幅で省略されないので40決め打ちで切っている -->
<v-col cols="12" class="mt-1 text-caption" style="min-width: 0;">
  <div class="d-flex align-center" style="overflow: hidden; min-width: 0;">
    <!-- 左のアイコン -->
    <v-icon small class="ms-1 me-2" style="flex-shrink: 0;" title="投稿コメント">mdi-comment</v-icon>

    <!-- コメントテキスト + 右側アイコン群 -->
    <div class="d-flex align-center" style="flex: 1 1 auto; overflow: hidden; min-width: 0;">
      <!-- コメントテキスト -->
      <div
        class="text-truncate"
        style="
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
          min-width: 0;
        "
      >
        {{ replay.upload_comment }}
      </div>

      <!-- 右側アイコン群 -->
      <div class="d-flex align-center ms-2" style="flex-shrink: 0; gap: 4px;min-width: 0;">
        <NuxtLink :to="`/replays/${replay.replay_id}`" style="text-decoration: none; color: inherit;">
          <v-icon icon="mdi-information-outline" variant="tonal" title="詳細情報" />
        </NuxtLink>

        <v-icon icon="mdi-trash-can-outline" variant="tonal" color="error" @click="$emit('confirmDelete', replay)" title="削除" />

        <v-icon icon="mdi-share-variant" variant="tonal" @click="$emit('confirmShare', replay)" title="シェア" />

        <a
          :href="`${useRuntimeConfig().public.backend_url}/replays/${replay.replay_id}/file`"
          target="_blank"
          rel="noopener"
          style="text-decoration: none; color: inherit;"
        >
          <v-icon icon="mdi-tray-arrow-down" variant="tonal" title="ダウンロード" />
        </a>
      </div>
    </div>
  </div>
</v-col>
      </v-row>
    </v-card-text>

    <!-- アイコン群（右上） -->    
    <!-- <div class="d-flex align-center" style="position: absolute; top: 8px; right: 12px; gap:8px;">
      <span>
        <v-chip 
          :color="useTableUtils().convertReplayType(replay.replay_meta.replay_type).color"
          small
        >
          {{ useTableUtils().convertReplayType(replay.replay_meta.replay_type).label }}
        </v-chip>
      </span>

      <span>
        <v-chip 
          :color="useTableUtils().convertCategory(replay.category).color"
          small
        >
          {{ useTableUtils().convertCategory(replay.category).label }}
        </v-chip>
      </span>
    </div> -->


  </v-col>
</v-card>

</template>

<script setup>
import { useTableUtils } from '~/composables/Games/TableUtils'
defineProps({
  replay: Object
})

defineEmits({
  showDetail: null,
  confirmDelete: null,
  confirmShare: null
})

const difficultyMap = {
  0: { label: 'Easy',     color: 'blue lighten-2' },
  1: { label: 'Normal',   color: 'green' },
  2: { label: 'Hard',     color: 'orange darken-1' },
  3: { label: 'Lunatic',  color: 'red darken-2' },
  4: { label: 'Extra',    color: 'deep-purple darken-2' },
  5: { label: 'Phantasm', color: 'cyan darken-2' }
}

const shotTypeMap = {
  ReimuA:   {label: '霊夢A',    color: useTableUtils().convertCharacter('Reimu').color},
  ReimuB:   {label: '霊夢B',    color: useTableUtils().convertCharacter('Reimu').color},
  MarisaA:  {label: '魔理沙A',  color: useTableUtils().convertCharacter('Marisa').color},
  MarisaB:  {label: '魔理沙B',  color: useTableUtils().convertCharacter('Marisa').color}
}

function convertDifficulty(level_id) {
  return difficultyMap[level_id] || { label: 'Unknown', color: 'grey' }
}

function convertShotType(shot_type_id){
  return shotTypeMap[shot_type_id] || {label: 'Unknown', color: 'white'}
}

</script>
