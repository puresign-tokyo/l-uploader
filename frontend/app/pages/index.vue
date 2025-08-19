<template>
  <v-main>
    <v-container>
      <v-card
        class="my-8 px-6 py-4"
        elevation="4"
        :style="{
          borderLeft: '8px solid var(--border-color)',
          backgroundColor: 'var(--v-theme-surface)',
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
      >
        <v-card-title class="text-h6 font-weight-bold mb-2">
          ようこそ、L-Uploaderへ！
        </v-card-title>

        <v-card-text class="text-body-1">
          ここは
          <a
            href="https://www16.big.or.jp/~zun/"
            target="_blank"
            rel="noopener noreferrer"
          >
            上海アリス幻樂団
          </a>
          が制作した東方Projectシリーズ作品のリプレイを投稿・閲覧できるアップローダです。
          <br />
          解析済みのリプレイファイルを確認・共有・ダウンロードすることができます。<br />
          まずは新規投稿からリプレイファイルをアップロードしてみましょう。
        </v-card-text>

        <v-card-actions class="mt-3">
          <v-btn
            to="/NewPost"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-upload"
          >
            新規投稿
          </v-btn>
          <v-btn
            to="/About"
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-information-outline"
          >
            対応作品
          </v-btn>
        </v-card-actions>

        <v-divider class="my-4" />

        <v-card-subtitle
          class="text-subtitle-2 font-weight-medium text-grey-darken-1"
        >
          最新の更新情報
        </v-card-subtitle>

        <v-list density="compact" class="px-2">
          <v-list-item v-for="(item, index) in release.changes" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <ClientOnly>
        <v-row class="mb-1">
          <v-col cols="12" md="4">
            <div class="d-flex align-center">
              <v-text-field
                v-model="inputedTag"
                label="タグ検索"
                placeholder="リプ会用"
                dense
                :rules="[validateOptionalTag]"
                :counter="config.optional_tag_length_limit"
              />
              <v-btn
                icon="mdi-magnify"
                class="ml-2"
                variant="tonal"
                size="small"
                style="position: relative; top: -10px"
                @click="applyTag"
              />
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedGame"
              :items="Object.keys(dropMenuGames)"
              label="作品を選択"
              hide-details
              outlined
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="selectedCategory"
              :items="Object.keys(dropMenuCategories)"
              label="カテゴリ"
              hide-details
              outlined
            />
          </v-col>
        </v-row>

        <template v-if="!loading">
          <component
            v-for="replay in replays"
            :key="replay.replay_id"
            :is="ReplayTable"
            :replayTable="getReplayTable(replay.game_id)(replay)"
            @confirmDelete="openDeleteDialog"
            @confirmShare="openShareDialog"
          />
          <v-pagination
            class="d-flex"
            v-model="replayPagination"
            :length="replayPaginationLimit"
            rounded="circle"
          />
        </template>
      </ClientOnly>
    </v-container>

    <!-- 削除ダイアログ -->
    <DeleteDialog
      :filename="pendingDeleteItem.filename"
      :replay_id="pendingDeleteItem.replay_id"
      v-model="deleteDialog"
      @result="openSnackBar"
    />

    <!-- 共有ダイアログ -->
    <ShareDialog
      :game_name="pendingShareItem.game_name"
      :filename="pendingShareItem.filename"
      :replay_id="pendingShareItem.replay_id"
      v-model="shareDialog"
      @result="openSnackBar"
    />

    <!-- スナックバー -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="outlined" @click="snackbar.visible = false"
          >閉じる</v-btn
        >
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, watch } from "vue";
import { ClientOnly } from "#components";

import ReplayTable from "~/components/ReplayTable.vue";
import DeleteDialog from "~/components/Dialogs/DeleteDialog.vue";
import ShareDialog from "~/components/Dialogs/ShareDialog.vue";

import { ErrorTable } from "~/composables/Games/Error";
import { Th06Table } from "~/composables/Games/Th06";
import { Th07Table } from "~/composables/Games/Th07";
import { Th08Table } from "~/composables/Games/Th08";
import { Th09Table } from "~/composables/Games/Th09";
import { Th10Table } from "~/composables/Games/Th10";
import { Th11Table } from "~/composables/Games/Th11";
import { Th12Table } from "~/composables/Games/Th12";
import { Th13Table } from "~/composables/Games/Th13";
import { Th14Table } from "~/composables/Games/Th14";
import { Th15Table } from "~/composables/Games/Th15";
import { Th16Table } from "~/composables/Games/Th16";
import { Th17Table } from "~/composables/Games/Th17";
import { Th18Table } from "~/composables/Games/Th18";
import { Th20Table } from "~/composables/Games/Th20";

import { Th95Table } from "~/composables/Games/Th95";
import { Th125Table } from "~/composables/Games/Th125";
import { Th128Table } from "~/composables/Games/Th128";
import { Th143Table } from "~/composables/Games/Th143";
import { Th165Table } from "~/composables/Games/Th165";
import { AlcoTable } from "~/composables/Games/Alco";

import { Releases } from "~/composables/ReleaseNotes";

const replays = ref([]);
const loading = ref(true);
const deleteDialog = ref(false);
const shareDialog = ref(false);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

const pendingDeleteItem = ref({});
const pendingShareItem = ref({});

const replayPagination = ref(1);
const replayPaginationLimit = ref(1);

const config = useRuntimeConfig().public;

const selectedGame = ref("全作品");
const selectedCategory = ref("全て");
const inputedTag = ref("");
const selectedTag = ref("");

const release = ref(Releases()[0]);

// 日付整形
const formatDate = (iso) =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(new Date(iso));

const dropMenuGames = {
  全作品: "all",
  東方紅魔郷: "th06",
  東方妖々夢: "th07",
  東方永夜抄: "th08",
  東方花映塚: "th09",
  東方文花帖: "th95",
  東方風神録: "th10",
  黄昏酒場: "alco",
  東方地霊殿: "th11",
  東方星蓮船: "th12",
  ダブルスポイラー: "th125",
  妖精大戦争: "th128",
  東方神霊廟: "th13",
  東方輝針城: "th14",
  弾幕アマノジャク: "th143",
  東方紺珠伝: "th15",
  東方天空璋: "th16",
  秘封ナイトメアダイアリー: "th165",
  東方鬼形獣: "th17",
  東方虹龍洞: "th18",
  東方錦上京: "th20",
};

const dropMenuCategories = {
  全て: "all",
  クリア: "clear",
  スコアタ: "score_run",
  ノーボム: "no_bomb",
  ノーミス: "no_miss",
  その他: "others",
};

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
  th20: Th20Table,

  th95: Th95Table,
  th125: Th125Table,
  th128: Th128Table,
  th143: Th143Table,
  th165: Th165Table,
  alco: AlcoTable,
};

const validateOptionalTag = (value) =>
  value.length <= config.optional_tag_length_limit ||
  config.optional_tag_length_limit + "文字以内で入力してください";

const getReplayTable = (gameId) => {
  return tableComponents[gameId] ?? ErrorTable;
};

await useFetch(`${config.backend_url}/replays/count`, {
  server: false,
  onResponse({ response }) {
    const countData = response._data;
    replayPaginationLimit.value = Math.max(
      1,
      Math.floor((Number(countData.count) - 1) / config.pagination_size) + 1
    );
  },
  onResponseError({ error }) {
    console.error(error);
    replayPagination.value = 1;
    openSnackBar({ success: false, message: String(error) });
  },
});

// リプレイ取得
await useFetch(`${config.backend_url}/replays?order=desc&page=0`, {
  server: false,
  onResponse({ response }) {
    const rawData = response._data;
    replays.value = rawData.map((item, i) => ({
      ...item,
      uploaded_at: formatDate(item.uploaded_at),
    }));
    loading.value = false;
  },
  onResponseError({ error }) {
    console.error(error);
    replays.value = [];
    loading.value = false;
    openSnackBar({ success: false, message: String(error) });
  },
});

const onPageChanged = async (newPage) => {
  try {
    const countData = await $fetch(
      `${config.backend_url}/replays/count?game_id=${
        dropMenuGames[selectedGame.value]
      }&category=${
        dropMenuCategories[selectedCategory.value]
      }&optional_tag=${encodeURIComponent(selectedTag.value)}`,
      {
        method: "get",
        server: false,
      }
    );

    replayPaginationLimit.value = Math.max(
      1,
      Math.floor((Number(countData.count) - 1) / config.pagination_size) + 1
    );

    if (replayPagination.value > replayPaginationLimit.value) {
      replayPagination.value = replayPaginationLimit.value;
      await onPageChanged(replayPagination.value);
      return;
    }

    const replaysData = await $fetch(
      `${config.backend_url}/replays?order=desc&page=${
        replayPagination.value - 1
      }&game_id=${dropMenuGames[selectedGame.value]}&category=${
        dropMenuCategories[selectedCategory.value]
      }&optional_tag=${encodeURIComponent(selectedTag.value)}`,
      {
        method: "get",
        server: false,
      }
    );

    replays.value = replaysData.map((item) => ({
      ...item,
      uploaded_at: formatDate(item.uploaded_at),
    }));
  } catch (error) {
    openSnackBar({ success: false, message: String(error) });
  }
};

const applyTag = () => {
  if (inputedTag.value.length <= config.optional_tag_length_limit) {
    selectedTag.value = inputedTag.value;
  } else {
    openSnackBar({
      success: false,
      message: `タグは${config.optional_tag_length_limit}文字以内で入力してください`,
    });
  }
};

watch(selectedTag, () => {
  if (replayPagination.value === 1) {
    onPageChanged(1);
  } else {
    replayPagination.value = 1;
  }
});

watch(selectedGame, () => {
  if (replayPagination.value === 1) {
    onPageChanged(1);
  } else {
    replayPagination.value = 1;
  }
});

watch(selectedCategory, () => {
  if (replayPagination.value === 1) {
    onPageChanged(1);
  } else {
    replayPagination.value = 1;
  }
});

watch(replayPagination, (newPage) => {
  onPageChanged(newPage);
});

// ダイアログ操作
function openDeleteDialog(payload) {
  pendingDeleteItem.value = payload;
  deleteDialog.value = true;
}

function openShareDialog(payload) {
  pendingShareItem.value = payload;
  shareDialog.value = true;
}

const openSnackBar = async (payload) => {
  snackbar.value.color = payload.success ? "success" : "error";
  snackbar.value.message =
    payload.message ??
    (payload.success ? "成功しました" : "エラーが発生しました");
  snackbar.value.visible = true;
  if (payload.page_reload) {
    await onPageChanged(replayPagination.value);
  }
};
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
