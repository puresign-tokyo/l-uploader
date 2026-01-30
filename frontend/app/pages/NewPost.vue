<template>
  <v-main>
    <v-container class="d-flex justify-center">
      <v-card
        class="w-100"
        max-width="600"
        elevation="4"
        style="align-items: stretch; min-height: 170px"
      >
        <v-card-title>
          {{ i18nT("pages.new_post.template.new_post.title") }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <div
            class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center"
          >
            <v-icon icon="mdi-file-outline" />
            {{
              i18nT(
                "pages.new_post.template.new_post.sections.replay_file.title",
              )
            }}
          </div>

          <v-row dense>
            <v-col cols="12">
              <v-file-input
                v-model="replayFile"
                accept=".rpy"
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.replay_file.contents.file_input.label',
                  )
                "
                :rules="[validateReplayFile]"
                persistent-hint
              >
                <template #details>
                  <I18nT
                    tag="div"
                    keypath="pages.new_post.template.new_post.sections.replay_file.contents.file_input.details.text"
                    class="text-caption"
                  >
                    <template #replay_path>
                      <NuxtLink
                        to="/About#explain-replay-path"
                        class="text-primary"
                      >
                        {{
                          i18nT(
                            "pages.new_post.template.new_post.sections.replay_file.contents.file_input.details.tags.replay_path",
                          )
                        }}
                      </NuxtLink>
                    </template>
                  </I18nT>
                </template>
              </v-file-input>
            </v-col>
          </v-row>

          <div
            class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center"
          >
            <v-icon icon="mdi-information-outline" />
            {{
              i18nT(
                "pages.new_post.template.new_post.sections.detail_info.title",
              )
            }}
          </div>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="userName"
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.user_name.label',
                  )
                "
                required
                :placeholder="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.user_name.place_holder',
                  )
                "
                :rules="[validateUserName]"
                :counter="Number(config.usernameLengthLimit)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">
              <v-select
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.category.label',
                  )
                "
                v-model="categoryTag"
                :items="Object.keys(categoryTags)"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="optionalTag"
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.optional_tag.label',
                  )
                "
                :placeholder="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.optional_tag.place_holder',
                  )
                "
                :rules="[validateOptionalTag]"
                :counter="Number(config.optionalTagLengthLimit)"
                :hint="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.optional_tag.hint',
                  )
                "
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="uploadComment"
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.upload_comment.label',
                  )
                "
                :placeholder="
                  i18nT(
                    'pages.new_post.template.new_post.sections.detail_info.contents.upload_comment.place_holder',
                  )
                "
                :rules="[validateUploadComment]"
                :counter="Number(config.uploadCommentLengthLimit)"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-subheader
            class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center"
          >
            <v-icon icon="mdi-trash-can-outline" color="error" />
            {{
              i18nT(
                "pages.new_post.template.new_post.sections.delete_password.title",
              )
            }}
          </v-subheader>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="deletePassword"
                :label="
                  i18nT(
                    'pages.new_post.template.new_post.sections.delete_password.contents.delete_password.label',
                  )
                "
                persistent-hint
                :hint="
                  i18nT(
                    'pages.new_post.template.new_post.sections.delete_password.contents.delete_password.hint',
                  )
                "
                required
                inputmode="latin"
                :counter="Number(config.deletePasswordLengthLimit)"
                :rules="[validateDeletePassword]"
                :type="showPassword ? 'text' : 'password'"
              >
                <template #append-inner>
                  <v-icon
                    :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="showPassword = !showPassword"
                    class="mr-2"
                    style="cursor: pointer"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mt-8">
              <div
                v-if="Boolean(config.recaptchaEnabled)"
                class="g-recaptcha"
                :data-sitekey="String(config.recaptchaSitekey)"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mt-4">
              <v-btn
                color="primary"
                :text="
                  i18nT('pages.new_post.template.new_post.sections.submit.text')
                "
                variant="tonal"
                @click="sendPostReplay"
              ></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <ClientOnly>
      <v-dialog
        v-model="dialogSuccessPost"
        max-width="600"
        scrim="rgba(0, 0, 0, 0.5)"
      >
        <v-card class="elevation-0">
          <v-card-title>{{
            i18nT("pages.new_post.template.dialog.title")
          }}</v-card-title>
          <v-container class="d-flex justify-center">
            <v-btn
              prepend-icon="mdi-twitter"
              color="blue darken-1"
              max-width="200"
              @click="shareToTweet"
            >
              {{
                i18nT("pages.new_post.template.dialog.contents.share_to_tweet")
              }}
            </v-btn>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :text="
                i18nT('pages.new_post.template.dialog.contents.return_home')
              "
              variant="plain"
              @click="router.push('/')"
            />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </ClientOnly>

    <!-- スナックバー -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="outlined" @click="snackbar.visible = false">
          {{ i18nT("pages.new_post.template.snack_bar.close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ClientOnly } from "#components";
import { ref } from "vue";
import { useI18n } from "#imports";
import { BackendUrl } from "~/composables/Settings";
import { useRuntimeConfig } from "#imports";

const router = useRouter();

const userName = ref("");
const replayFile = ref(null);
const uploadComment = ref("");
const deletePassword = ref("");
const categoryTag = ref("クリア");
const optionalTag = ref("");

const dialogSuccessPost = ref(false);
const pendingTweetText = ref("");
const showPassword = ref(false);
const config = useRuntimeConfig().public;

const { t: i18nT } = useI18n();

let wasOpened = false;
let postedReplayId = "";

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const categoryTags = {
  クリア: "clear",
  スコアアタック: "score_run",
  ノーボム: "no_bomb",
  ノーミス: "no_miss",
  その他: "others",
};

function isUseNonVisibleASCII(val) {
  const STRIP_NON_ASCII_VISIBLE_RE = /[^\x20-\x7E]/g;
  const filtered = val.replace(STRIP_NON_ASCII_VISIBLE_RE, "");
  return filtered !== val;
}

const validateUserName = (value) =>
  value.length <= Number(config.usernameLengthLimit) ||
  i18nT("pages.new_post.scripts.validations.string_length_limit", {
    string_length_limit: Number(config.usernameLengthLimit),
  });
const validateUploadComment = (value) =>
  value.length <= Number(config.uploadCommentLengthLimit) ||
  i18nT("pages.new_post.scripts.validations.string_length_limit", {
    string_length_limit: Number(config.uploadCommentLengthLimit),
  });
const validateDeletePassword = (value) => {
  if (value.length === 0) {
    return i18nT("pages.new_post.scripts.validations.input_required");
  }
  if (value.length > Number(config.deletePasswordLengthLimit)) {
    return i18nT("pages.new_post.scripts.validations.string_length_limit", {
      string_length_limit: Number(config.deletePasswordLengthLimit),
    });
  }
  if (isUseNonVisibleASCII(value)) {
    return i18nT("pages.new_post.scripts.validations.only_ascii");
  }
  if (value.trim().length === 0) {
    return i18nT("pages.new_post.scripts.validations.do_not_only_space");
  }
  return true;
};
const validateReplayFile = (value) => {
  if (!value) return true;
  if (value.size > Number(config.filesizeKbLimit) * 1024) {
    return i18nT("pages.new_post.scripts.validations.too_large_file");
  }
  return true;
};
const validateOptionalTag = (value) =>
  value.length <= Number(config.optionalTagLengthLimit) ||
  i18nT("pages.new_post.scripts.validations.string_length_limit", {
    string_length_limit: Number(config.optionalTagLengthLimit),
  });

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://www.google.com/recaptcha/api.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

async function sendPostReplay() {
  if (userName.value === "") {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.username_required",
    );
    snackbar.value.color = "error";
    return;
  }
  if (userName.value.length > Number(config.usernameLengthLimit)) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.username_length_limit_exceed",
      {
        username_length_limit: Number(config.usernameLengthLimit),
      },
    );
    snackbar.value.color = "error";
    return;
  }
  if (uploadComment.value.length > Number(config.uploadCommentLengthLimit)) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.upload_comment_length_limit_exceed",
      {
        upload_comment_length_limit: Number(config.uploadCommentLengthLimit),
      },
    );
    snackbar.value.color = "error";
    return;
  }
  if (replayFile.value === null) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.replay_file_required",
    );
    snackbar.value.color = "error";
    return;
  }
  if (isUseNonVisibleASCII(deletePassword.value)) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.delete_password_is_only_ascii",
    );
    snackbar.value.color = "error";
    return;
  }
  if (deletePassword.value.length > Number(config.deletePasswordLengthLimit)) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.delete_password_length_limit_exceed",
      {
        delete_password_length_limit: Number(config.deletePasswordLengthLimit),
      },
    );
    snackbar.value.color = "error";
    return;
  }
  if (deletePassword.value === "") {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.delete_password_required",
    );
    snackbar.value.color = "error";
    return;
  }
  if (deletePassword.value.trim().length === 0) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.delete_password_do_not_only_space",
    );
    snackbar.value.color = "error";
    return;
  }
  if (optionalTag.value.length > Number(config.optionalTagLengthLimit)) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.optional_tag_length_limit_exceed",
      {
        optional_tag_length_limit: Number(config.optionalTagLengthLimit),
      },
    );
    snackbar.value.color = "error";
    return;
  }

  let response = "";
  if (Boolean(config.recaptchaEnabled)) {
    response = window.grecaptcha?.getResponse();
  } else {
    response = "";
  }
  if (Boolean(config.recaptchaEnabled) && !response) {
    snackbar.value.visible = true;
    snackbar.value.message = i18nT(
      "pages.new_post.scripts.snack_bar.validations.recapcha_required",
    );
    snackbar.value.color = "error";
    return;
  }

  const formData = new FormData();
  formData.append("user_name", userName.value);
  formData.append("replay_file", replayFile.value);
  formData.append("upload_comment", uploadComment.value);
  formData.append("delete_password", deletePassword.value);
  formData.append("category", categoryTags[categoryTag.value]);
  formData.append("optional_tag", optionalTag.value);
  formData.append("recaptcha_token", response);
  try {
    await $fetch(`${BackendUrl()}/replays`, {
      method: "post",
      body: formData,
      onResponse({ response }) {
        if (200 <= response.status && response.status < 300) {
          replayFile.value = null;
          uploadComment.value = "";
          pendingTweetText.value = i18nT("pages.new_post.scripts.share.tweet", {
            url: `${window.location.origin}/replays/${response._data["replay_id"]}`,
          });

          dialogSuccessPost.value = true;
        }
        snackbar.value.visible = true;
        snackbar.value.message = i18nT(
          "pages.new_post.scripts.snack_bar.http_requested.replay_submitted",
        );
        snackbar.value.color = "success";
        postedReplayId = response._data["replay_id"];
      },
    });
  } catch (error) {
    snackbar.value.visible = true;
    snackbar.value.color = "error";
    if (error?.response?.status === 429) {
      snackbar.value.message = i18nT(
        "pages.new_post.scripts.snack_bar.http_required.too_many_requested",
      );
    } else {
      snackbar.value.message = `${error?.statusCode};${error?.statusMessage};${error?.data?.detail}`;
    }
  }
}

watch(dialogSuccessPost, (val) => {
  if (val) {
    wasOpened = true;
  } else if (wasOpened && postedReplayId !== "") {
    router.push("/replays/" + postedReplayId);
  }
});

const shareToTweet = () => {
  const text = encodeURIComponent(pendingTweetText.value);
  window.open(`https://twitter.com/intent/tweet?text=${text}`);
  dialogSuccessPost.value = false;
  router.push("/");
};

useHead({
  title: i18nT("pages.new_post.title"),
});
</script>
