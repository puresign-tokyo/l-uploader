<template>
  <v-main>
    <v-container>
      <p>
        このページは
        <a href="https://www16.big.or.jp/~zun/" target="_blank" rel="noopener noreferrer">
          上海アリス幻樂団
        </a>
        が作成した東方Projectシリーズのリプレイアップローダです。
      </p>
    </v-container>

    <ClientOnly>
      <v-container>
        <component
          v-for="replay in replays"
          :key="replay.replay_id"
          :is="getComponentForReplayTable(replay.game_id)"
          :replay="replay"
          @delete="openDeleteDialog"
          @detail="openFocusedDialog"
        />
      </v-container>

      <!-- 詳細ダイアログ -->
      <v-dialog v-model="detailDialog" max-width="600" scrim="rgba(0, 0, 0, 0.5)" attach="body">
        <v-card class="elevation-0">
          <v-container>
            <v-list v-for="(item, index) in detailFields" :key="index">
              <v-list-item-subtitle class="custom-v-list-item-subtitle">{{ item.label }}</v-list-item-subtitle>
              <v-list-item>
                <v-list-item-title class="custom-v-list-item-title">{{ focusedItem[item.value] }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-list>
              <v-list-item-subtitle class="custom-v-list-item-subtitle">ダウンロードリンク</v-list-item-subtitle>
              <v-list-item>
                <v-list-item-title class="custom-v-list-item-title">
                  <a :href="createDownloadLink(focusedItem.replay_id)">
                    {{ focusedItem.replay_file_name }}
                  </a>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-container>

          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn text="閉じる" variant="plain" @click="detailDialog = false" />
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 削除ダイアログ -->
      <v-dialog v-model="dialog" max-width="600" scrim="rgba(0, 0, 0, 0.5)" attach="body">
        <v-card
          :title="`${pendingDeleteItem?.replay_file_name ?? ''}を削除する`"
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
            <v-btn text="閉じる" variant="plain" @click="dialog = false" />
            <v-btn color="error" text="削除" variant="tonal" @click="sendDeleteReplay" />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </ClientOnly>

    <!-- スナックバー -->
    <v-snackbar v-model="snackbar">
      削除しました
      <template #actions>
        <v-btn color="success" variant="outlined" @click="snackbar = false">閉じる</v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { ClientOnly } from '#components'

// コンポーネント
import Th06Table from '~/components/ReplayTables/th06Table.vue'
// import Th13Table from '~/components/ReplayTables/th13Table.vue'
// import Th14Table from '~/components/ReplayTables/th14Table.vue'

const replays = ref([])
const loading = ref(true)
const snackbar = ref(false)
const dialog = ref(false)
const detailDialog = ref(false)
const pendingDeleteItem = ref(null)
const focusedItem = ref({})
const deletePassword = ref('')
const showPassword = ref(false)

// フィールドラベル設定（仮置き）
const detailFields = [
  { label: 'プレイヤー', value: 'player_name' },
  { label: 'キャラ', value: 'character' },
  { label: 'スコア', value: 'score' },
  // 必要に応じて拡張
]

// 日付整形
const formatDate = (iso) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Tokyo'
  }).format(new Date(iso))

// コンポーネントの取得
const tableComponents = {
  th06: Th06Table,
}
const getComponentForReplayTable = (gameId) => tableComponents[gameId] || Th13Table

const createDownloadLink = (replayId) =>
  `${useRuntimeConfig().public.backend_url}/replays/${replayId}/file`

// リプレイ取得
await useFetch(`${useRuntimeConfig().public.backend_url}/replays?order=desc&offset=0&limit=1000`, {
  server: false,
  onResponse({ response }) {
    console.log("API response:",response)
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

// ダイアログ操作
function openDeleteDialog(item) {
  pendingDeleteItem.value = item
  dialog.value = true
}
function openFocusedDialog(item) {
  focusedItem.value = item
  detailDialog.value = true
}

// 削除リクエスト
async function sendDeleteReplay() {
  try {
    await $fetch(`${useRuntimeConfig().public.backend_url}/replays/${pendingDeleteItem.value.replay_id}`, {
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