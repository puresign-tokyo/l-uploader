<template>
  <v-main>
    <ClientOnly>
      <v-layout>
        <v-container class="mt-5">
          <v-card v-if="loading">
            <v-skeleton-loader type="card"></v-skeleton-loader>
          </v-card>

          <v-card v-else-if="errorResponse">
            <I18nT
              keypath="pages.replays.replay_id.template.card.replay_fetch_error"
              tag="v-alert"
              type="error"
              color="red darken-1"
              icon="mdi-alert-circle"
            >
              <template #br>
                <br />
              </template>
            </I18nT>
          </v-card>

          <template v-else>
            <div
              class="d-flex flex-row"
              style="
                position: fixed;
                top: 72px;
                right: 32px;
                gap: 8px;
                z-index: 1000;
              "
            >
              <!-- v-fabとtonalを組み合わせると後ろが透けてしまう --->
              <v-btn
                icon
                style="background-color: #fdd8d5; color: #b00020"
                rounded="circle"
                @click="deleteDialog = true"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-fab icon="mdi-share-variant" @click="shareDialog = true" />
              <a
                v-if="replayTable.replay_id"
                :href="`${backendUrl}/replays/${replayTable.replay_id}/file`"
                target="_blank"
                rel="noopener"
                style="text-decoration: none; color: inherit"
              >
                <v-fab icon="mdi-tray-arrow-down" />
              </a>
            </div>

            <v-card class="d-flex flex-column my-8" elevation="4" replay>
              <!-- <v-col no-gutters class="pa-2"> -->
              <div
                class="d-flex flex-row align-center ml-4"
                style="width: 100%"
              >
                <div
                  class="hidden-sm-and-down"
                  style="padding: 10px 0 10px 10px; flex-shrink: 0"
                >
                  <v-img
                    :src="replayTable.game_meta.img.full"
                    :alt="replayTable.game_meta.img.alt"
                    width="95"
                    height="95"
                    cover
                    class="rounded-lg elevation-2"
                    style="opacity: 0.6"
                  />
                </div>

                <div
                  class="pa-2 d-flex flex-column justify-space-between align-center"
                  style="
                    padding-left: 0px;
                    flex-shrink: 0;
                    min-width: 0;
                    max-width: 100%;
                  "
                >
                  <v-card-text class="pa-0" elevation="0" style="min-width: 0">
                    <v-row no-gutters align="baseline" style="min-width: 0">
                      <!-- テキスト + アイコン sm以下は改行する-->

                      <v-col cols="12" class="d-flex align-baseline">
                        <span class="text-h4 font-weight-bold">
                          {{ replayTable.filename }}
                        </span>
                      </v-col>

                      <v-col cols="12" class="d-flex align-baseline">
                        <v-icon
                          small
                          class="mr-1"
                          :title="
                            i18nT(
                              'pages.replays.replay_id.template.card.user_name',
                            )
                          "
                        >
                          mdi-account
                        </v-icon>
                        <span v-if="true" class="text-h5 font-weight-bold mr-5">
                          {{ replayTable.user_name }}
                        </span>

                        <span class="text-caption text--secondary">
                          {{ replayTable.uploaded_at }}
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </div>
              </div>

              <v-divider />

              <v-row class="ml-4 mr-2 mt-1 align-center" style="min-width: 0">
                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.game_name')
                    "
                  >
                    mdi-controller
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.game_name")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p>{{ replayTable.game_meta.name }}</p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.total_score')
                    "
                  >
                    mdi-trophy
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.total_score")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p class="text-h5 font-weight-bold">
                    {{ replayTable.total_score ?? "-" }}
                  </p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.division')
                    "
                  >
                    mdi-flag
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.division")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <div class="d-flex flex-wrap" style="gap: 8px; min-width: 0">
                    <span>
                      <v-chip
                        v-if="replayTable.difficulty"
                        :color="replayTable.difficulty.color"
                        text-color="white"
                        small
                      >
                        {{ replayTable.difficulty.label }}
                      </v-chip>
                    </span>
                    <span>
                      <v-chip
                        v-if="replayTable.shot_type"
                        :style="{
                          border: `2px solid ${replayTable.shot_type.color}`,
                          fontWeight: 500,
                          minWidth: '0px',
                        }"
                        variant="outlined"
                      >
                        {{ replayTable.shot_type.label }}
                      </v-chip>
                    </span>
                    <span>
                      <v-chip
                        v-if="replayTable.optional_division"
                        :color="replayTable.optional_division.color"
                        text-color="white"
                        small
                      >
                        {{ replayTable.optional_division.label }}
                      </v-chip>
                    </span>
                  </div>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.category')
                    "
                  >
                    mdi-flag-outline
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.category")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <div class="d-flex flex-wrap" style="gap: 8px; min-width: 0">
                    <span>
                      <v-chip
                        v-if="replayTable.replay_type"
                        :color="replayTable.replay_type.color"
                        text-color="white"
                        small
                      >
                        {{ replayTable.replay_type.label }}
                      </v-chip>
                    </span>
                    <span>
                      <v-chip
                        v-if="replayTable.category"
                        :color="replayTable.category.color"
                        text-color="white"
                        small
                      >
                        {{ replayTable.category.label }}
                      </v-chip>
                    </span>
                  </div>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT(
                        'pages.replays.replay_id.template.card.optional_tag',
                      )
                    "
                  >
                    mdi-tag-outline
                  </v-icon>
                  <span>
                    {{
                      i18nT(
                        "pages.replays.replay_id.template.card.optional_tag",
                      )
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p v-if="replayTable.optional_tag">
                    {{ replayTable.optional_tag }}
                  </p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.replay_name')
                    "
                  >
                    mdi-badge-account-outline
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.replay_name")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p>{{ replayTable.replay_name ?? "-" }}</p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.timestamp')
                    "
                  >
                    mdi-calendar-clock
                  </v-icon>
                  <span>
                    {{
                      i18nT("pages.replays.replay_id.template.card.timestamp")
                    }}
                  </span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p>{{ replayTable.timestamp ?? "-" }}</p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT('pages.replays.replay_id.template.card.slowdown')
                    "
                  >
                    mdi-play-speed
                  </v-icon>
                  <span>{{
                    i18nT("pages.replays.replay_id.template.card.slowdown")
                  }}</span>
                </v-col>
                <v-col cols="12" md="9" class="d-flex">
                  <p>{{ replayTable.slowdown ?? "-" }}</p>
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />

                <v-col cols="12" md="3" class="d-flex mb-5">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT(
                        'pages.replays.replay_id.template.card.upload_comment',
                      )
                    "
                  >
                    mdi-comment
                  </v-icon>
                  <span>
                    {{
                      i18nT(
                        "pages.replays.replay_id.template.card.upload_comment",
                      )
                    }}
                  </span>
                </v-col>
                <v-col
                  cols="12"
                  md="9"
                  class="d-flex pl-2 pr-2 mb-5"
                  style="
                    width: 100%;
                    flex: 1 1 auto;
                    overflow-y: auto;
                    min-width: 0;
                    white-space: pre-wrap;
                  "
                >
                  {{ replayTable.upload_comment }}
                </v-col>
                <v-col cols="12" v-if="display.smAndDown.value" />
              </v-row>

              <v-row class="ml-4 mr-10 align-center" style="min-width: 0">
                <v-col cols="12" class="d-flex mt-1">
                  <v-icon
                    small
                    class="mr-1"
                    :title="
                      i18nT(
                        'pages.replays.replay_id.template.card.stage_splits',
                      )
                    "
                  >
                    mdi-chart-line
                  </v-icon>
                  <span>
                    {{
                      i18nT(
                        "pages.replays.replay_id.template.card.stage_splits",
                      )
                    }}
                  </span>
                </v-col>
                <v-col cols="12" class="d-flex mb-5">
                  <v-data-table
                    v-if="replayTable.stage_details.items.length !== 0"
                    :headers="replayTable.stage_details.headers"
                    :items="replayTable.stage_details.items"
                    :items-per-page="0"
                    :style="{
                      whiteSpace: 'nowrap',
                    }"
                    hide-default-footer
                  />
                  <span v-else>
                    {{
                      i18nT(
                        "pages.replays.replay_id.template.card.cant_show_stage_splits",
                      )
                    }}
                  </span>
                </v-col>
              </v-row>
            </v-card>
          </template>
        </v-container>
      </v-layout>

      <!-- 削除ダイアログ -->
      <DeleteDialog
        v-if="!loading"
        :filename="
          replayTable.filename ??
          i18nT('pages.replays.replay_id.template.dialog.unknown.filename')
        "
        :replay_id="
          replayTable.replay_id ??
          i18nT('pages.replays.replay_id.template.dialog.unknown.replay_id')
        "
        v-model="deleteDialog"
        @result="openSnackBar"
      />

      <!-- 共有ダイアログ -->
      <ShareDialog
        v-if="!loading"
        :user_name="
          replayTable.user_name ??
          i18nT('pages.replays.replay_id.template.dialog.unknown.user_name')
        "
        :upload_comment="
          replayTable.upload_comment ??
          i18nT(
            'pages.replays.replay_id.template.dialog.unknown.upload_comment',
          )
        "
        :game_name="replayTable.game_meta.name"
        :filename="
          replayTable.filename ??
          i18nT('pages.replays.replay_id.template.dialog.unknown.filename')
        "
        :replay_id="
          replayTable.replay_id ??
          i18nT('pages.replays.replay_id.template.dialog.unknown.replay_id')
        "
        v-model="shareDialog"
        @result="openSnackBar"
      />

      <!-- スナックバー -->
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
        {{ snackbar.message }}
        <template #actions>
          <v-btn variant="outlined" @click="snackbar.visible = false">
            {{ i18nT("pages.replays.replay_id.template.snack_bar.close") }}
          </v-btn>
        </template>
      </v-snackbar>
    </ClientOnly>
  </v-main>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { I18nT, useI18n } from "vue-i18n";
import { ClientOnly } from "#components";
import { useBackendUrl } from "~/composables/Settings";
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

const display = useDisplay();
const { t: i18nT, locale } = useI18n();
const backendUrl = useBackendUrl();

type StageDetailsRow = Record<string, string | number | boolean | null>;

interface ReplayTable {
  game_meta: {
    theme_color: string;
    img: { full: string; thumb: string; alt: string };
    name: string;
  };
  filename: string | null;
  uploaded_at: string | null;
  user_name: string | null;
  total_score: string | null;
  replay_name: string | null;
  slowdown: string | null;
  timestamp: string | null;
  difficulty: { label: string; color: string } | null;
  shot_type: { label: string; color: string } | null;
  optional_division: { label: string; color: string } | null;
  optional_tag: string | null;
  upload_comment: string | null;
  replay_type: { label: string; color: string } | null;
  category: { label: string; color: string } | null;
  replay_id: string | null;
  stage_details: {
    headers: {
      title: string;
      key: string;
      sortable?: boolean;
      fixed?: boolean;
    }[];
    items: StageDetailsRow[];
  };
}

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const errorResponse = ref(false);
const deleteDialog = ref(false);
const shareDialog = ref(false);
const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
});

let replayTable: ReplayTable;

type TableParser = (data: any) => ReplayTable;
const tableComponents: Record<string, TableParser> = {
  th6: Th06Table,
  th7: Th07Table,
  th8: Th08Table,
  th9: Th09Table,
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

async function refreshReplay() {
  try {
    const response = await $fetch<{ game_id: string }>(
      `${backendUrl}/replays/${route.params.replay_id}`,
      {
        method: "get",
      },
    );
    if (tableComponents[response?.game_id]) {
      replayTable = tableComponents[response?.game_id](response);
    } else {
      replayTable = ErrorTable(response);
    }
    loading.value = false;
  } catch (error) {
    throw showError({
      statusCode: (error as any)?.statusCode ?? (error as any)?.status ?? 500,
      statusMessage:
        (error as any)?.statusMessage ??
        (error as any)?.message ??
        "Unknown error",
      data: error,
    });
    console.error(error);
    errorResponse.value = true;
    loading.value = false;
  }
}

await refreshReplay();

const openSnackBar = async (payload: {
  success: boolean;
  message: string;
  page_reload: boolean;
}) => {
  snackbar.value.color = payload.success ? "success" : "error";
  snackbar.value.message =
    payload.message ??
    (payload.success
      ? i18nT("pages.replays.replay_id.scripts.snack_bar.payload.success")
      : i18nT("pages.replays.replay_id.scripts.snack_bar.payload.error"));
  snackbar.value.visible = true;
  if (payload.page_reload) {
    router.push("/");
  }
};

watch(locale, () => {
  refreshReplay();
});

useHead({
  title: i18nT("pages.replays.replay_id.title"),
});

useSeoMeta({
  robots: "noindex, nofollow",
});
</script>
