<template>
  <v-dialog
    v-model="deleteDialog"
    max-width="600"
    scrim="rgba(0, 0, 0, 0.5)"
    attach="body"
  >
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
        <v-row dense>
          <v-col cols="12" class="d-flex justify-center mt-8">
            <div
              v-if="config.recaptcha_enabled"
              ref="recaptchaRef"
              class="g-recaptcha"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text="閉じる" variant="plain" @click="deleteDialog = false" />
        <v-btn
          color="error"
          text="削除"
          variant="tonal"
          @click="sendDeleteReplay"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const deletePassword = ref("");
const showPassword = ref(false);
const deleteDialog = defineModel<boolean>();
const config = useRuntimeConfig().public;

const recaptchaRef = ref<HTMLElement | null>(null);
let widgetId: number | null = null;

const props = defineProps<{
  filename: string;
  replay_id: string;
}>();

const emit = defineEmits<{
  (
    e: "result",
    payload: { success: boolean; message: string; page_reload: boolean }
  ): void;
}>();

async function sendDeleteReplay() {
  // 同じrecaptchaキーは再度削除リクエストに使えないがダイアログをつけっぱなしだとさもパスワードを間違えた後も使えるように見えてしまう
  // そのため削除リクエストを送る度に毎回削除ダイアログを消すようにする
  deleteDialog.value = false;

  let response = "";
  if (config.recaptcha_enabled) {
    response = (window as any).grecaptcha?.getResponse();
  } else {
    response = "";
  }
  if (config.recaptcha_enabled && !response) {
    emit("result", {
      success: false,
      message: "reCAPTCHAを確認してください",
      page_reload: false,
    });
    return;
  }

  try {
    await $fetch(`${config.backend_url}/replays/${props.replay_id}`, {
      method: "delete",
      body: {
        delete_password: deletePassword.value,
        recaptcha_token: response,
      },
      headers: { "Content-Type": "application/json" },
      server: false,
      onResponse({ response }) {
        if (response.status >= 200 && response.status < 300) {
          deleteDialog.value = false;
          emit("result", {
            success: true,
            message: "削除しました",
            page_reload: true,
          });
        }
      },
    });
  } catch (error) {
    const e = error as {
      statusCode?: number;
      statusMessage?: string;
      data?: { detail?: string };
    };
    let msg;
    if (e?.data?.detail === "password mismatch") {
      msg = "パスワードが違います";
    } else if (e?.statusCode === 429) {
      msg =
        "短時間で何回もパスワードを間違えています。時間を置いて削除してください。";
    } else {
      msg = `${e.statusCode};${e.statusMessage};${e.data?.detail}`;
    }
    emit("result", { success: false, message: msg, page_reload: false });
  }
}

function renderRecaptcha() {
  if (!recaptchaRef.value) return;
  const g = (window as any).grecaptcha;
  if (!g) return;
  // widgetId が残っているケースはrenderさせないことで再度ダイアログを開いたときは再生成させる。
  widgetId = g.render(recaptchaRef.value, {
    sitekey: config.recaptcha_sitekey,
  });
}

watch(deleteDialog, async (open) => {
  if (open) {
    await nextTick();
    renderRecaptcha();
  } else {
    // 閉じるときは必ず破棄して次回は render させる
    widgetId = null;
    if (recaptchaRef.value) recaptchaRef.value.innerHTML = "";
  }
});

onMounted(() => {
  if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
});
</script>
