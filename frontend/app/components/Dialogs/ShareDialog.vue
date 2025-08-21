<template>
  <v-dialog
    v-model="shareDialog"
    max-width="600"
    scrim="rgba(0, 0, 0, 0.5)"
    attach="body"
  >
    <v-card
      :title="`${props.filename}をシェアする`"
      text="どこでシェアしますか？"
      class="elevation-0"
    >
      <v-row justify="center" align="center" class="my-4">
        <v-btn icon="mdi-link" class="mx-4" @click="shareToLink" />

        <v-btn icon="mdi-twitter" class="mx-4" @click="shareToTweet" />
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

const props = defineProps<{
  game_name: string;
  filename: string;
  replay_id: string;
}>();

const emit = defineEmits<{
  (
    e: "result",
    payload: { success: boolean; message: string; page_reload: boolean }
  ): void;
}>();

const shareToTweet = () => {
  const text = encodeURIComponent(
    `#えるろだ\n${props.filename}\n${props.game_name}のリプレイ\n詳細はこちらから！`
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
