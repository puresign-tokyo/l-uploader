<template>
  <v-main>
    <v-layout >
      <v-container class="mt-5">
        <v-card v-if="loading">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-card>

        <v-card v-else-if="errorResponse">
          <v-alert type="error" color="red darken-1" icon="mdi-alert-circle">
            データの取得中にエラーが発生しました。<br>
            リロードするか、後でもう一度お試しください。
          </v-alert>
        </v-card>

        <template v-else>
          <div
            class="d-flex flex-row"
            style="position: fixed; top: 72px; right: 32px; gap: 8px; z-index: 1000"
          >
            <v-fab
              variant="tonal" 
              color="error"
              icon="mdi-trash-can-outline"
            />
            <v-fab
              icon="mdi-share-variant"
            />
            <v-fab
              icon="mdi-tray-arrow-down"
            />
          </div>
          
          <v-card 
            class="d-flex flex-column my-8"
            elevation="4"
            replay
          >
          
            <!-- <v-col no-gutters class="pa-2"> -->
            <div class="d-flex flex-row align-center ml-4" style="width: 100%;">

              <div class="hidden-sm-and-down" style="padding: 10px 0 10px 10px; flex-shrink: 0;">
                <v-img
                  src="/images/full/th06.jpg"
                  alt="th06"
                  width="95"
                  height="95"
                  cover
                  class="rounded-lg elevation-2"
                  style="opacity: 0.6;"
                />
              </div>
      


              <div class="pa-2 d-flex flex-column justify-space-between align-center" style="padding-left: 0px; flex-shrink: 0; min-width: 0; max-width: 100%;">
                <v-card-text class="pa-0" elevation="0" style="min-width: 0;" >
                  <v-row no-gutters align="baseline" style="min-width: 0;">
                    <!-- テキスト + アイコン sm以下は改行する-->

                    <v-col cols="12" class="d-flex align-baseline">
                      <span class="text-h4 font-weight-bold">
                        {{ replay.filename }}
                      </span>
                    </v-col>

                    <v-col cols="12" class="d-flex align-baseline">
                      <v-icon small class="mr-1" title="ユーザ名">mdi-account</v-icon>
                        <span
                          v-if="true"
                          class="text-h5 font-weight-bold mr-5"
                        > 
                          {{ replay.user_name }}
                        </span>
                        
                        <span class="text-caption text--secondary">
                          YYYY/MM/DD HH:MM
                        </span>
                    </v-col>

                  </v-row>
                </v-card-text>
              </div>
            </div>

            <v-divider/>
            
            <v-row class="ml-4 mr-2 mt-1 align-center" style="min-width: 0;">

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="ゲーム名">mdi-controller</v-icon>
                <span>ゲーム名</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p>東方紅魔郷 ～ Embodiment of Scarlet Devil.</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="スコア">mdi-trophy</v-icon>
                <span>スコア</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p class="text-h5 font-weight-bold">10,000</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="部門">mdi-flag</v-icon>
                <span>部門</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <div class="d-flex flex-wrap" style="gap:8px;min-width: 0;">
                  <span>
                    <v-chip
                      
                      color="red" text-color="white" small>
                      Lunatic
                    </v-chip>
                    
                  </span>
                  <span>
                    <v-chip
                    
                    color="red" text-color="white" small>
                    霊夢A
                    </v-chip>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="カテゴリ">mdi-flag-outline</v-icon>
                <span>カテゴリ</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <div class="d-flex flex-wrap" style="gap:8px;min-width: 0;">
                  <span>
                    <v-chip
                      
                      color="red" text-color="white" small
                    >
                      通しプレイ
                    </v-chip>
                    
                  </span>
                  <span>
                    <v-chip
                    
                      color="red" text-color="white" small
                    >
                      スコアアタック
                    </v-chip>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="カテゴリ">mdi-tag-outline</v-icon>
                <span>オプションタグ</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p>なんちゃら</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="リプレイ名">mdi-badge-account-outline</v-icon>
                <span>リプレイ名</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p>HOGEHOGE</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="リプレイ作成日">mdi-calendar-clock</v-icon>
                <span>リプレイ作成日</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p>YYYY/MM/DD HH:MM</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex">
                <v-icon small class="mr-1" title="処理落ち率">mdi-play-speed</v-icon>
                <span>処理落ち率</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex">
                <p>5%</p>
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

              <v-col cols="12" md="3" class="d-flex mb-5">
                <v-icon small class="mr-1" title="コメント">mdi-comment</v-icon>
                <span>コメント</span>
              </v-col>
              <v-col cols="12" md="9" class="d-flex pl-2 pr-2 mb-5" style="width: 100%;flex: 1 1 auto; overflow-y: auto; min-width: 0; white-space: pre-wrap;">
                  {{ replay.upload_comment }}
              </v-col>
              <v-col cols="12" v-if="display.smAndDown.value"/>

            </v-row>

            <v-row class="ml-10 mr-10 align-center" style="min-width: 0;">

              <v-col cols="12" class="d-flex mt-1">
                <v-icon small class="mr-1" title="プレイ進行">mdi-chart-line</v-icon>
                <span>プレイ進行</span>
              </v-col>
              <v-col cols="12" class="d-flex ">
                <v-data-table
                  :items="[
                    {
                      ステージ: '1',
                      残機: '1',
                      ボム: '1',
                      スコア: '100',
                    },
                    {
                      ステージ: '2',
                      残機: '2',
                      ボム: '2',
                      スコア: '200',
                    }
                  ]"
                  :items-per-page="0"
                  hide-default-footer

                ></v-data-table>
              </v-col>
            </v-row>
          
          </v-card>
        </template>

      </v-container>
    </v-layout>
      
    
  </v-main>
</template>

<script setup>
import { useDisplay } from 'vuetify';
const display=useDisplay()
// import Th06Detail from '~/components/Games/Th06/Th06Detail.vue'

const route = useRoute()
const loading = ref(true)
const errorResponse=ref(false)
const replay=ref({})

const detailComponents = {
  // th06: Th06Detail,
}

// const getComponentForReplayDetail = (gameId)=>detailComponents[gameId] || Th06Detail

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