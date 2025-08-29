<template>
  <v-dialog
    v-model="shareDialog"
    max-width="600"
    scrim="rgba(0, 0, 0, 0.5)"
    attach="body"
  >
    <v-card
      :title="`${props.filename}をシェアする`"
      text="どのようにシェアしますか？"
      class="elevation-0"
    >
      <v-row justify="center" align="center" class="my-4">
        <v-btn
          icon="mdi-link"
          class="mx-4"
          @click="shareToLink"
          title="リンク"
        />
        <v-btn
          icon="mdi-text-box-multiple"
          class="mx-4"
          title="情報一覧コピー"
          @click="shareMeta"
        />
        <v-btn
          icon="mdi-twitter"
          class="mx-4"
          title="Twitter共有"
          @click="shareToTweet"
        />
      </v-row>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn text="閉じる" variant="plain" @click="shareDialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const shareDialog = defineModel<boolean>();
const config = useRuntimeConfig().public;

const props = defineProps<{
  game_name: string;
  user_name: string;
  upload_comment: string;
  filename: string;
  replay_id: string;
}>();

const emit = defineEmits<{
  (
    e: "result",
    payload: { success: boolean; message: string; page_reload: boolean }
  ): void;
}>();

function truncateGameSubTitle(game_name: string) {
  return game_name.split(" ")[0];
}

function truncateWithEllipsis(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 1) + "…";
}

const shareToTweet = () => {
  const game_name = truncateGameSubTitle(props.game_name);

  const user_name = truncateWithEllipsis(
    props.user_name,
    Number(config.username_share_length_limit)
  );
  const upload_comment = truncateWithEllipsis(
    props.upload_comment,
    Number(config.upload_comment_share_length_limit)
  );
  const text = encodeURIComponent(
    `#えるろだ
${props.filename}
${game_name} ${user_name}
${upload_comment}`
  );
  const url = encodeURIComponent(
    `${window.location.origin}/replays/${props.replay_id}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  shareDialog.value = false;
  emit("result", {
    success: true,
    message: "Twitterリンクに飛びました",
    page_reload: false,
  });
};

const shareMeta = async () => {
  try {
    const game_name = truncateGameSubTitle(props.game_name);

    const user_name = truncateWithEllipsis(
      props.user_name,
      Number(config.username_share_length_limit)
    );
    const upload_comment = truncateWithEllipsis(
      props.upload_comment,
      Number(config.upload_comment_share_length_limit)
    );
    await navigator.clipboard.writeText(
      `${game_name} ${user_name}
${upload_comment}`
    );
    emit("result", {
      success: true,
      message: "情報一覧をコピーしました",
      page_reload: false,
    });
  } catch (err) {
    emit("result", {
      success: false,
      message: String(err),
      page_reload: false,
    });
  }
};

const shareToLink = async () => {
  try {
    await navigator.clipboard.writeText(
      `${window.location.origin}/replays/${props.replay_id}`
    );
    emit("result", {
      success: true,
      message: "リンクをコピーしました",
      page_reload: false,
    });
  } catch (err) {
    emit("result", {
      success: false,
      message: String(err),
      page_reload: false,
    });
  }
};
</script>
