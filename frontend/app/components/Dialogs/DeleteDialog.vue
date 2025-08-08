<template>
  <v-dialog v-model="deleteDialog" max-width="600" scrim="rgba(0, 0, 0, 0.5)" attach="body">
    <v-card
      :title="`${props.filename}を削除する`"
      text="削除用パスワードを入力してください"
      class="elevation-0"
    >
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="deletePassword"
              max-width="360px"
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
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { el } from 'vuetify/locale'

const deletePassword=ref('')
const showPassword=ref(false)
const deleteDialog=defineModel<boolean>()
const config = useRuntimeConfig().public

const props=defineProps<{
  filename: string
  replay_id: string
}>()

const emit = defineEmits<{
  (e: 'result', payload: { success: boolean; message: string; page_reload: boolean }): void
}>()

async function sendDeleteReplay() {
  try {
    await $fetch(`${config.backend_url}/replays/${props.replay_id}`, {
      method: 'delete',
      body: { delete_password: deletePassword.value },
      headers: { 'Content-Type': 'application/json' },
      server: false,
      onResponse({ response }) {
        if (response.status >= 200 && response.status < 300) {
          // dialog.value = false
          // snackbar.value = true
          // replays.value = replays.value.filter(r => r.replay_id !== pendingDeleteItem.value.replay_id)
          deleteDialog.value=false
          emit('result',{success: true, message: '削除しました', page_reload: true})
        }
      }
    })
  } catch (error) {
    const e = error as { statusCode?: number; statusMessage?: string; data?: { detail?: string } }
    // const msg = e?.data?.detail === 'password mismatch'
    //   ? 'パスワードが違います'
    //   : `${e.statusCode};${e.statusMessage};${e.data?.detail}`
    let msg
    if (e?.data?.detail === 'password mismatch'){
      msg = 'パスワードが違います'
    }else if(e?.statusCode === 429){
      msg = '短時間で何回もパスワードを間違えています。時間を置いて削除してください。'
    }else{
      msg = `${e.statusCode};${e.statusMessage};${e.data?.detail}`
    }
    emit('result', { success: false, message: msg, page_reload: false })
  }
}

</script>