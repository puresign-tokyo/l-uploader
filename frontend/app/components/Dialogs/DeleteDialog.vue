<template>
  <v-dialog
    v-model="deleteDialog"
    max-width="600"
    scrim="rgba(0, 0, 0, 0.5)"
    attach="body"
  >
    <v-card
      :title="
        i18nT('components.dialogs.delete_dialog.template.delete.title', {
          filename: props.filename,
        })
      "
      :text="i18nT('components.dialogs.delete_dialog.template.delete.text')"
      class="elevation-0"
    >
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="deletePassword"
              max-width="360px"
              :label="
                i18nT(
                  'components.dialogs.delete_dialog.template.delete.contents.password_text_field.label',
                )
              "
              required
              inputmode="latin"
              :counter="Number(config.deletePasswordLengthLimit)"
              :rules="[validateDeletePassword]"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" class="d-flex justify-center mt-8">
            <div
              v-if="Number(config.recaptchaEnabled)"
              ref="recaptchaRef"
              class="g-recaptcha"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          :text="
            i18nT(
              'components.dialogs.delete_dialog.template.delete.contents.button_close',
            )
          "
          variant="plain"
          @click="deleteDialog = false"
        />
        <v-btn
          color="error"
          :text="
            i18nT(
              'components.dialogs.delete_dialog.template.delete.contents.button_delete',
            )
          "
          variant="tonal"
          @click="sendDeleteReplay"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "#imports";
import { useRuntimeConfig } from "#imports";
import { useBackendUrl } from "~/composables/Settings";
const { t: i18nT } = useI18n();
const deletePassword = ref("");
const showPassword = ref(false);
const deleteDialog = defineModel<boolean>();
const config = useRuntimeConfig().public;
const backendUrl = useBackendUrl();

const recaptchaRef = ref<HTMLElement | null>(null);
let widgetId: number | null = null;

function isUseNonVisibleASCII(val: string) {
  const STRIP_NON_ASCII_VISIBLE_RE = /[^\x20-\x7E]/g;
  const filtered = val.replace(STRIP_NON_ASCII_VISIBLE_RE, "");
  return filtered !== val;
}

const validateDeletePassword = (value: string) => {
  if (value.length === 0) {
    return i18nT(
      "components.dialogs.delete_dialog.scripts.validation.delete_password_required",
    );
  }
  if (value.length > Number(config.deletePasswordLengthLimit)) {
    return i18nT(
      "components.dialogs.delete_dialog.scripts.validation.delete_password_length_limit_exceed",
      {
        delete_password_length_limit: Number(config.deletePasswordLengthLimit),
      },
    );
  }
  if (isUseNonVisibleASCII(value)) {
    return i18nT(
      "components.dialogs.delete_dialog.scripts.validation.delete_password_is_only_ascii",
    );
  }
  if (value.trim().length === 0) {
    return i18nT(
      "components.dialogs.delete_dialog.scripts.validation.delete_password_do_not_only_space",
    );
  }
  return true;
};

const props = defineProps<{
  filename: string;
  replay_id: string;
}>();

const emit = defineEmits<{
  (
    e: "result",
    payload: { success: boolean; message: string; page_reload: boolean },
  ): void;
}>();

async function sendDeleteReplay() {
  // 同じrecaptchaキーは再度削除リクエストに使えないがダイアログをつけっぱなしだとさもパスワードを間違えた後も使えるように見えてしまう
  // そのため削除リクエストを送る度に毎回削除ダイアログを消すようにする
  deleteDialog.value = false;

  if (isUseNonVisibleASCII(deletePassword.value)) {
    emit("result", {
      success: false,
      message: i18nT(
        "components.dialogs.delete_dialog.scripts.validation.delete_password_is_only_ascii",
      ),
      page_reload: false,
    });
    return;
  }
  if (deletePassword.value === "") {
    emit("result", {
      success: false,
      message: i18nT(
        "components.dialogs.delete_dialog.scripts.validation.delete_password_required",
      ),
      page_reload: false,
    });
    return;
  }
  if (deletePassword.value.length > Number(config.deletePasswordLengthLimit)) {
    emit("result", {
      success: false,
      message: i18nT(
        "components.dialogs.delete_dialog.scripts.validation.delete_password_length_limit_exceed",
        {
          delete_password_length_limit: Number(
            config.deletePasswordLengthLimit,
          ),
        },
      ),
      page_reload: false,
    });
    return;
  }
  if (deletePassword.value.trim().length === 0) {
    emit("result", {
      success: false,
      message: i18nT(
        "components.dialogs.delete_dialog.scripts.validation.delete_password_do_not_only_space",
      ),
      page_reload: false,
    });
    return;
  }

  let response = "";
  if (Boolean(config.recaptchaEnabled)) {
    response = (window as any).grecaptcha?.getResponse();
  } else {
    response = "";
  }
  if (Boolean(config.recaptchaEnabled) && !response) {
    emit("result", {
      success: false,
      message: i18nT(
        "components.dialogs.delete_dialog.scripts.validation.recaptcha_required",
      ),
      page_reload: false,
    });
    return;
  }

  try {
    await $fetch(`${backendUrl}/replays/${props.replay_id}`, {
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
            message: i18nT(
              "components.dialogs.delete_dialog.scripts.http_requested.success",
            ),
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
      msg = i18nT(
        "components.dialogs.delete_dialog.scripts.http_requested.password_mismatch",
      );
    } else if (e?.statusCode === 429) {
      msg = i18nT(
        "components.dialogs.delete_dialog.scripts.http_requested.too_many_requested",
      );
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
    sitekey: String(config.recaptchaSitekey),
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
