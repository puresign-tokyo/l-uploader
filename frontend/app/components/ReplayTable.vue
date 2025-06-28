<template>

<v-card
  class="d-flex my-8"
  elevation="4"
    :style="{
    '--border-color': replayTable.game_meta.theme_color,
    borderLeft: '8px solid var(--border-color)',
    alignItems: 'stretch',
    minHeight: '170px',
    minWidth: '0',
  }"
  replay
>
  <!-- 画像 -->
  <div class="hidden-sm-and-down" style="padding: 10px 0 10px 10px; flex-shrink: 0;">
    <v-img
      :src=replayTable.game_meta.img.img
      :alt=replayTable.game_meta.img.alt
      width="100"
      height="150"
      cover
      class="rounded-lg elevation-2"
      style="opacity: 0.6;"
    />
  </div>


  <v-col class="pa-2 d-flex justify-space-between align-start" style="flex: 1 1 auto;min-width: 0;">
    <v-card-text class="pa-0" elevation="0" style="min-width: 0;">
      <v-row no-gutters align="baseline" style="min-width: 0;">
        <!-- テキスト + アイコン sm以下は改行する-->
        <v-col cols="12" v-if="display.smAndDown.value">
          <div style="height: 25px;"></div>
        </v-col>
        <v-col cols="12" md="3">
          <div
            v-if="props.replayTable.filename"
            class="text-h6 font-weight-bold"
          >
            {{ props.replayTable.filename }}
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <span
            v-if="replayTable.uploaded_at"
            class="text-caption text--secondary ml-2"
          >
            {{ props.replayTable.uploaded_at }}
          </span>
        </v-col>
        <v-col cols="6" md="6">
            <span
              v-if="replayTable.user_name"
              class="text-caption text--secondary ml-2"
            >
              <v-icon small class="mr-1" title="ユーザ名">mdi-account</v-icon>
              {{ props.replayTable.user_name }}
            </span>
        </v-col>

        <v-col cols="12" class="d-flex align-center">
          <v-icon small class="mr-1" title="ゲーム名">mdi-controller</v-icon>
          <strong>{{ props.replayTable.game_meta.name }}</strong>
        </v-col>


        <!-- スコア -->
        <v-col cols="12" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="スコア">mdi-trophy</v-icon>
          <span class="text-h5 font-weight-bold">
          {{ props.replayTable.total_score ? props.replayTable.total_score : '-' }}
          </span>
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="リプレイ名">mdi-badge-account-outline</v-icon>
          <p v-if="props.replayTable.replay_name">
            {{ props.replayTable.replay_name }}
          </p>
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="処理落ち率">mdi-play-speed</v-icon>
          処理落ち率: {{ props.replayTable.slowdown ? props.replayTable.slowdown : '-' }}
        </v-col>

        <v-col cols="4" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="リプレイ作成日">mdi-calendar-clock</v-icon>
          {{ props.replayTable.timestamp ? props.replayTable.timestamp : '-' }}
        </v-col>



        <!-- 難易度 + 機体 + タグ-->
        <v-col cols="12" md="9" class="d-flex align-center mt-1" style="min-width: 0;">
          <v-icon small class="mr-1" title="難易度 機体">mdi-flag</v-icon>
          <div class="d-flex flex-wrap" style="gap:8px;min-width: 0;">
            <v-chip
              v-if="props.replayTable.difficulty"
              :color="props.replayTable.difficulty.color" text-color="white" small>
              {{ props.replayTable.difficulty.label }}
            </v-chip>

            <v-chip
              v-if="props.replayTable.shot_type"
              :style="{
                border: `2px solid ${props.replayTable.shot_type.color}`,
                fontWeight: 500,
                minWidth: '0px',
              }"
              variant="outlined"
            >
              {{ props.replayTable.shot_type.label }}
            </v-chip>
            
            <v-chip
              v-if="props.replayTable.optional_division"
              :color="props.replayTable.optional_division.color"
              text-color="white"
              small
              style="min-width: 0;"
            >
              {{ props.replayTable.optional_division.label }}
            </v-chip>

          </div>
        </v-col>

        <!-- オプションタグ -->

        <v-col cols="12" md="3" class="d-flex align-center mt-1">
          <v-icon small class="mr-1" title="オプションタグ">mdi-tag-outline</v-icon>
          <v-chip 
            color="grey"
            small
          >
            {{ props.replayTable.optional_tag }}
          </v-chip>
        </v-col>


        <!-- コメント -->
        <!-- どうやっても横幅で省略されないので40決め打ちで切っている -->
        <v-col cols="12" class="mt-1" style="min-width: 0;">
          <div class="d-flex align-center" style="overflow: hidden; min-width: 0;">
            <!-- 左のアイコン -->
            <v-icon small class="ms-1 me-2 text-body-1" style="flex-shrink: 0;" title="投稿コメント">mdi-comment</v-icon>

            <!-- コメントテキスト + 右側アイコン群 -->
            <div class="d-flex align-center" style="flex: 1 1 auto; overflow: hidden; min-width: 0;">
              <!-- コメントテキスト -->
              <div
                class="text-truncate text-caption"
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  flex-grow: 1;
                  min-width: 0;
                "
              >
                {{ props.replayTable.upload_comment }}
              </div>

              <!-- 右側アイコン群 -->
              <div class="d-flex align-center ms-2" style="flex-shrink: 0; gap: 4px;min-width: 0;">
                <NuxtLink
                  v-if="props.replayTable.replay_id"
                  :to="`/replays/${props.replayTable.replay_id}`"
                  style="text-decoration: none; color: inherit;"
                >
                  <v-icon
                    icon="mdi-information-outline"
                    variant="tonal"
                    title="詳細情報"
                    :class="{ 'text-disabled': !props.replayTable.replay_id }"
                  />
                </NuxtLink>

                <v-icon
                  icon="mdi-trash-can-outline"
                  variant="tonal"
                  color="error"
                  :class="{ 'text-disabled': !props.replayTable.replay_id }"
                  @click="props.replayTable.replay_id && $emit('confirmDelete', replayTable)"
                  title="削除"
                />

                <v-icon icon="mdi-share-variant" variant="tonal" @click="$emit('confirmShare', props.replayTable)" title="シェア" />

                <a
                  v-if="props.replayTable.replay_id"
                  :href="`${useRuntimeConfig().public.backend_url}/replays/${props.replayTable.replay_id}/file`"
                  target="_blank"
                  rel="noopener"
                  style="text-decoration: none; color: inherit;"
                >
                  <v-icon
                    icon="mdi-tray-arrow-down"
                    variant="tonal"
                    title="ダウンロード"
                  />
                </a>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- アイコン群（右上） -->    
    <div class="d-flex align-center" style="position: absolute; top: 8px; right: 12px; gap:8px;">
      <span>
        <v-chip
          v-if="props.replayTable.replay_type"
          :color="props.replayTable.replay_type.color"
          small
          label
        >
          {{ props.replayTable.replay_type.label }}
        </v-chip>
      </span>

      <span>
        <v-chip
          v-if="props.replayTable.category"
          :color="props.replayTable.category.color"
          small
          label
        >
          {{ props.replayTable.category.label }}
        </v-chip>
      </span>
    </div>



  </v-col>
</v-card>

</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const display=useDisplay()

interface ReplayTable{
  game_meta: {
    theme_color: string,
    img: {img: string, alt: string},
    name: string
  },
  filename: string | null,
  uploaded_at: string | null,
  user_name: string | null,
  total_score: string | null,
  replay_name: string | null,
  slowdown: string | null,
  timestamp: string | null,
  difficulty: {label: string, color: string} | null,
  shot_type: {label: string, color: string} | null,
  optional_division: {label: string, color: string} | null,
  optional_tag: {label: string, color: string} | null,
  upload_comment: string | null,
  replay_type: {label: string, color: string} | null,
  category: {label: string, color: string} | null,
  replay_id: string | null,
}


const props=defineProps<{
  replayTable: ReplayTable
}>()

defineEmits({
  confirmDelete: null,
  confirmShare: null
})


</script>
