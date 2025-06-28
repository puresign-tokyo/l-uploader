<template>
  <v-main>
    <v-container>
        <v-card
          class="d-flex flex-column my-8"
          elevation="4"
          :style="{
            borderLeft: '8px solid var(--border-color)',
            alignItems: 'stretch',
            minHeight: '170px',
            minWidth: '0'
          }"
        >
          <p>
            このページは
            <a href="https://www16.big.or.jp/~zun/" target="_blank" rel="noopener noreferrer">
              上海アリス幻樂団
            </a>
            が作成した東方Projectシリーズのリプレイアップローダです。
          </p>
        </v-card>
      
    </v-container>
    <ClientOnly>
    <v-container>

        <!-- <v-card
          class="d-flex flex-column my-8"
          elevation="4"
          :style="{
            borderLeft: '8px solid var(--border-color)',
            alignItems: 'stretch',
            minHeight: '170px',
            minWidth: '0'
          }"
        >
          <v-select
            v-model="selectedGame"
            :items="Object.keys(dropMenuGame)"
            label="作品を選択"
            outlined
          />

          <v-select
            v-model="selectedOrder"
            :items="Object.keys(dropMenuOrder)"
            label="表示順"
            outlined
          />
          
        </v-card> -->

      <v-card
        class="d-flex flex-column my-8"
        elevation="4"
        :style="{
          borderLeft: '8px solid var(--border-color)',
          alignItems: 'stretch',
          minWidth: '0'
        }"
      >
        <v-pagination
          v-model="replayPagination"
          :length="replayPaginationLimit"
          rounded="circle"
        ></v-pagination>
      </v-card>
    </v-container>

    <v-container v-if="!loading">
      <component
        v-for="replay in replays"
        :key="replay.replay_id"
        :is="ReplayTable"
        :replayTable="getReplayTable(replay.game_id)(replay)"
        @showDetail="openDetailDialog"
        @confirmDelete="openDeleteDialog"
        @confirmShare="openShareDialog"
      />
    </v-container>

    <v-container>
      <v-card
        class="d-flex flex-column my-8"
        elevation="4"
        :style="{
          borderLeft: '8px solid var(--border-color)',
          alignItems: 'stretch',
          minWidth: '0'
        }"
      >
        <v-pagination
          v-model="replayPagination"
          :length="replayPaginationLimit"
          rounded="circle"
        ></v-pagination>
      </v-card>
    </v-container>

    </ClientOnly>


      <!-- 削除ダイアログ -->
      <v-dialog v-model="deleteDialog" max-width="600" scrim="rgba(0, 0, 0, 0.5)" attach="body">
        <v-card
          :title="`${pendingDeleteItem.filename}を削除する`"
          text="削除用パスワードを入力してください"
          class="elevation-0"
        >
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="4" sm="6">
                <v-text-field
                  v-model="deletePassword"
                  label="削除用パスワード"
                  required
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn text="閉じる" variant="plain" @click="deleteDialog = false" />
            <v-btn color="error" text="削除" variant="tonal" @click="sendDeleteReplay" />
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="shareDialog" max-width="600" scrim="rgba(0, 0, 0, 0.5)" attach="body">
        <v-card
          :title="`${pendingShareItem.filename}をシェアする`"
          text="どこでシェアしますか？"
          class="elevation-0"
        >

          <v-icon
            icon="mdi-link"
            @click="shareToCopy"
          />

          <v-icon
            icon="mdi-twitter"
            @clink="shareToTweet"
          />
        
          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn text="閉じる" variant="plain" @click="shareDialog = false" />
          </v-card-actions>
        </v-card>
      </v-dialog>

    <!-- スナックバー -->
    <v-snackbar v-model="deleteSnackbar">
      削除しました
      <template #actions>
        <v-btn color="success" variant="outlined" @click="snackbar = false">閉じる</v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="clipboardSnackbar">
      クリップボードにコピーしました
      <template #actions>
        <v-btn color="success" variant="outlined" @click="snackbar = false">閉じる</v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ClientOnly } from '#components'
import { CommonUtils } from '~/composables/CommonUtils'


import ReplayTable from '~/components/ReplayTable.vue'

import { ErrorTable } from '~/composables/Games/Error'
import { Th06Table } from '~/composables/Games/Th06'
import { Th07Table } from '~/composables/Games/Th07'
import { Th08Table } from '~/composables/Games/Th08'
import { Th09Table } from '~/composables/Games/Th09'
import { Th10Table } from '~/composables/Games/Th10'
import { Th11Table } from '~/composables/Games/Th11'
import { Th12Table } from '~/composables/Games/Th12'
import { Th13Table } from '~/composables/Games/Th13'
import { Th14Table } from '~/composables/Games/Th14'
import { Th15Table } from '~/composables/Games/Th15'
import { Th16Table } from '~/composables/Games/Th16'
import { Th17Table } from '~/composables/Games/Th17'
import { Th18Table } from '~/composables/Games/Th18'

import { Th95Table } from '~/composables/Games/Th95'
import { Th125Table } from '~/composables/Games/Th125'
import { Th128Table } from '~/composables/Games/Th128'
import { Th143Table } from '~/composables/Games/Th143'
import { Th165Table } from '~/composables/Games/Th165'


const replays = ref([])
const loading = ref(true)
const clipboardSnackbar = ref(false)
const deleteSnackbar = ref(false)
const detailDialog = ref(false)
const deleteDialog = ref(false)
const shareDialog = ref(false)

const showDetailItem = ref({})
const pendingDeleteItem = ref({})
const pendingShareItem = ref({})

const deletePassword = ref('')
const showPassword = ref(false)

const replayPagination = ref(1)
const replayPaginationLimit = ref(1)

const config = useRuntimeConfig().public

const selectedGame=ref('全作品')
const selectedOrder=ref('新しい順')

// 日付整形
const formatDate = (iso) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Tokyo'
  }).format(new Date(iso))

// const dropMenuGame={  
//   '全作品':     all,
//   '東方紅魔郷': th06,
//   '東方妖々夢': th07,
//   '東方永夜抄': th08,
//   '東方花映塚': th09,
//   '東方文花帖': th95,
//   '東方風神録': th10,
//   '黄昏酒場':   alco,
//   '東方地霊殿': th11,
//   '東方星蓮船': th12,
//   'ダブルスポイラー': th125,
//   '妖精大戦争': th128,
//   '東方神霊廟': th13,
//   '東方輝針城': th14,
//   '弾幕アマノジャク': th143,
//   '東方紺珠伝': th15,
//   '東方天空璋': th16,
//   '秘封ナイトメアダイアリー': th165,
//   '東方鬼形獣': th17,
//   '東方虹龍洞': th18,
// }

// const dropMenuOrder={
//   '新しい順': 'desc',
//   '古い順': 'asc'
// }

// コンポーネントの取得
const tableComponents = {
  th06: Th06Table,
  th07: Th07Table,
  th08: Th08Table,
  th09: Th09Table,
  th10: Th10Table,
  th11: Th11Table,
  th12: Th12Table,
  th13: Th13Table,
  th14: Th14Table,
  th15: Th15Table,
  th16: Th16Table,
  th17: Th17Table,
  th18: Th18Table,

  th95: Th95Table,
  th125: Th125Table,
  th128: Th128Table,
  th143: Th143Table,
  th165: Th165Table
  // 黄昏酒場とナイトメアダイアリーが作れていない
}
const getReplayTable = (gameId) => {
  return tableComponents[gameId] ?? ErrorTable
}

await useFetch(`${config.backend_url}/replays/count`, {
  server: false,
  onResponse({ response }) {
    const countData = response._data
    replayPaginationLimit.value = Math.max(1, Math.floor((Number(countData.count) - 1) / config.pagination_size) + 1)
  },
  onResponseError({ error }) {
    console.error(error)
    replayPagination.value = 1
  },
})

// リプレイ取得
await useFetch(`${config.backend_url}/replays?order=desc&offset=0&limit=${config.pagination_size}`, {
  server: false,
  onResponse({ response }) {
    const rawData = response._data
    replays.value = rawData.map((item, i) => ({
      ...item,
      uploaded_at: formatDate(item.uploaded_at),
    }))
    loading.value = false
  },
  onResponseError({ error }) {
    console.error(error)
    replays.value = []
    loading.value = false
  },
})

const onPageChanged= async (newPage)=>{
  try {
    const countData = await $fetch(`${config.backend_url}/replays/count`, {
      method: 'get',
      server: false
    })

    replayPaginationLimit.value = Math.max(1, Math.floor((Number(countData.count) - 1) / config.pagination_size) + 1)

    if (replayPagination.value > replayPaginationLimit.value) {
      replayPagination.value = replayPaginationLimit.value
      await onPageChanged(replayPagination.value)
      return
    }

    const replaysData = await $fetch(`${config.backend_url}/replays?order=desc&offset=${config.pagination_size * (replayPagination.value - 1)}&limit=${config.pagination_size}`, {
      method: 'get',
      server: false
    })

    replays.value = replaysData.map((item) => ({
      ...item,
      uploaded_at: formatDate(item.uploaded_at),
    }))
  } catch (error) {
    console.error(error)
  }
}

watch(replayPagination, (newPage)=>{
  onPageChanged(newPage)
})

// ダイアログ操作
function openDetailDialog(item) {
  showDetailItem.value = item
  detailDialog.value = true
}

function openDeleteDialog(item) {
  pendingDeleteItem.value = item
  deleteDialog.value = true
}

function openShareDialog(item){
  pendingShareItem.value = item
  shareDialog.value = true
}


// 削除リクエスト
async function sendDeleteReplay() {
  try {
    await $fetch(`${config.backend_url}/replays/${pendingDeleteItem.value.replay_id}`, {
      method: 'delete',
      body: { delete_password: deletePassword.value },
      headers: { 'Content-Type': 'application/json' },
      server: false,
      onResponse({ response }) {
        if (response.status >= 200 && response.status < 300) {
          dialog.value = false
          snackbar.value = true
          replays.value = replays.value.filter(r => r.replay_id !== pendingDeleteItem.value.replay_id)
        }
      }
    })
  } catch (error) {
    const msg = error?.data?.detail === 'password mismatch'
      ? 'パスワードが違います'
      : `${error.statusCode};${error.statusMessage};${error.data.detail}`
    alert(msg)
  }
}

const shareToCopy = async()=>{
  try {
    await navigator.clipboard.writeText(text)
    clipboardSnackbar.value = true
  } catch (err) {
    console.error(err)
    alert('コピーに失敗しました')
  }
}

const shareToTweet=()=>{
  const text=encodeURIComponent(`${CommonUtils().convertGameId(pendingShareItem.value.game_id)}のリプレイをアップロードしました！\n詳細はこちら！`)
  const url=encodeURIComponent(`${window.location.origin}/replays/${pendingShareItem.value.replay_id}`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
  dialogSuccessPost.value=false
}

</script>

<style scoped>
.custom-v-list-item-subtitle {
  font-size: 0.75rem;
}
.custom-v-list-item-title {
  white-space: normal;
  text-overflow: unset;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>