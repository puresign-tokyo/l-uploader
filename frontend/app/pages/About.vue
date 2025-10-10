<template>
  <v-main>
    <v-container class="d-flex flex-column justify-center">
      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
        id="explain-replay-path"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.replay_path.title") }}
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT(
                  "pages.about.template.replay_path.sections.until_th12.title"
                )
              }}
            </h3>
            <p>
              {{
                i18nT(
                  "pages.about.template.replay_path.sections.until_th12.contents.paragraph"
                )
              }}
            </p>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <I18nT
                keypath="pages.about.template.replay_path.sections.until_th12.contents.lists.games_replay_folder.text"
                tag="li"
              >
                <template #replay>
                  <v-code>
                    {{
                      i18nT(
                        "pages.about.template.replay_path.sections.until_th12.contents.lists.games_replay_folder.tags.replay"
                      )
                    }}
                  </v-code>
                </template>
              </I18nT>
              <li>
                <v-code>
                  {{
                    i18nT(
                      "pages.about.template.replay_path.sections.until_th12.contents.lists.virtual_store.text"
                    )
                  }}
                </v-code>
              </li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT(
                  "pages.about.template.replay_path.sections.since_th125.title"
                )
              }}
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                <v-code>
                  {{
                    i18nT(
                      "pages.about.template.replay_path.sections.since_th125.contents.text"
                    )
                  }}
                </v-code>
              </li>
            </ul>
          </section>
          <section class="mb4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT("pages.about.template.replay_path.sections.note.title")
              }}
            </h3>
            <I18nT
              keypath="pages.about.template.replay_path.sections.note.contents.text"
              tag="p"
            >
              <template #search_query>
                <v-code>
                  {{
                    i18nT(
                      "pages.about.template.replay_path.sections.note.contents.tags.search_query"
                    )
                  }}
                </v-code>
              </template>
            </I18nT>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.compatible_games.title") }}
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT(
                  "pages.about.template.compatible_games.sections.mainline_games.title"
                )
              }}
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>東方紅魔郷 〜 the Embodiment of Scarlet Devil.</li>
              <li>東方妖々夢 〜 Perfect Cherry Blossom.</li>
              <li>東方永夜抄 ～ Imperishable Night.</li>
              <li>東方花映塚 〜 Phantasmagoria of Flower View.</li>
              <li>東方風神録 〜 Mountain of Faith.</li>
              <li>東方地霊殿 〜 Subterranean Animism.</li>
              <li>東方星蓮船 〜 Undefined Fantastic Object.</li>
              <li>東方神霊廟 〜 Ten Desires.</li>
              <li>東方輝針城 〜 Double Dealing Character.</li>
              <li>東方紺珠伝 〜 Legacy of Lunatic Kingdom.</li>
              <li>東方天空璋 〜 Hidden Star in Four Seasons.</li>
              <li>東方鬼形獣 〜 Wily Beast and Weakest Creature.</li>
              <li>東方虹龍洞 〜 Unconnected Marketeers.</li>
              <li>東方錦上京 〜 Fossilized Wonders.</li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT(
                  "pages.about.template.compatible_games.sections.side_games.title"
                )
              }}
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>東方文花帖 〜 Shoot the Bullet.</li>
              <li>ダブルスポイラー 〜 東方文花帖</li>
              <li>妖精大戦争 〜 東方三月精</li>
              <li>弾幕アマノジャク 〜 Impossible Spell Card.</li>
              <li>秘封ナイトメアダイアリー 〜 Violet Detector.</li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT(
                  "pages.about.template.compatible_games.sections.other_games.title"
                )
              }}
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>黄昏酒場 ～Uwabami Breakers～</li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.license.title") }}
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{
                i18nT("pages.about.template.license.sections.source_code.title")
              }}
            </h3>
            <I18nT
              keypath="pages.about.template.license.sections.source_code.contents.text"
              tag="p"
            >
              <template #apache_license_2_0>
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{
                    i18nT(
                      "pages.about.template.license.sections.source_code.tags.apache_license_2_0"
                    )
                  }}
                </a>
              </template>
              <template #github>
                <a
                  href="https://github.com/puresign-tokyo/l-uploader"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{
                    i18nT(
                      "pages.about.template.license.sections.source_code.tags.github"
                    )
                  }}
                </a>
              </template>
            </I18nT>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              {{ i18nT("pages.about.template.license.sections.logo.title") }}
            </h3>
            <p>
              {{
                i18nT(
                  "pages.about.template.license.sections.logo.contents.creator"
                )
              }}
            </p>
            <p>
              {{
                i18nT(
                  "pages.about.template.license.sections.logo.contents.do_not_modify"
                )
              }}
            </p>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.staff.title") }}
        </v-card-title>

        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              <a
                href="https://wefma.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{
                  i18nT("pages.about.template.staff.sections.wefmaika.title")
                }}
              </a>
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.wefmaika.contents.lists.developper"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.wefmaika.contents.lists.server_management"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.wefmaika.contents.lists.operation_management"
                  )
                }}
              </li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <a
                href="https://info.puresign.tokyo"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ i18nT("pages.about.template.staff.sections.irckk.title") }}
              </a>
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.irckk.contents.lists.domain_management"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.irckk.contents.lists.operation"
                  )
                }}
              </li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <a
                href="https://x.com/kamoneko_nonaku"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{
                  i18nT("pages.about.template.staff.sections.kamo_kun.title")
                }}
              </a>
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.kamo_kun.contents.lists.develop_consign"
                  )
                }}
              </li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <p>{{ i18nT("pages.about.template.staff.sections.om.title") }}</p>
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.staff.sections.om.contents.lists.create_logo"
                  )
                }}
              </li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.third_parties.title") }}
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <I18nT
              tag="h3"
              keypath="pages.about.template.third_parties.sections.silentselene.title.text"
              class="text-subtitle-1 font-weight-medium"
            >
              <template #silentselene>
                <a
                  href="https://www.silentselene.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{
                    i18nT(
                      "pages.about.template.third_parties.sections.silentselene.title.tags.silentselene"
                    )
                  }}
                </a>
              </template>
            </I18nT>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.third_parties.sections.silentselene.contents.lists.parse_replay"
                  )
                }}
              </li>
            </ul>
            <I18nT
              tags="h3"
              keypath="pages.about.template.third_parties.sections.tsadecode.title.text"
              class="text-subtitle-1 font-weight-medium"
            >
              <template #tsadecode>
                <a
                  href="https://pypi.org/project/tsadecode/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{
                    i18nT(
                      "pages.about.template.third_parties.sections.tsadecode.title.tags.tsadecode"
                    )
                  }}
                </a>
              </template>
            </I18nT>

            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                {{
                  i18nT(
                    "pages.about.template.third_parties.sections.tsadecode.contents.lists.decode_replay"
                  )
                }}
              </li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          {{ i18nT("pages.about.template.donation.title") }}
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <p>
              {{
                i18nT(
                  "pages.about.template.donation.sections.donation.contents.cause"
                )
              }}
            </p>
            <I18nT
              tag="p"
              keypath="pages.about.template.donation.sections.donation.contents.donation_page.text"
            >
              <template #here>
                <a
                  href="https://ofuse.me/wefmaika"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{
                    i18nT(
                      "pages.about.template.donation.sections.donation.contents.donation_page.tags.here"
                    )
                  }}
                </a>
              </template>
            </I18nT>
          </section>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>
<script setup lang="ts">
import { I18nT, useI18n } from "vue-i18n";
const { t: i18nT } = useI18n();
useHead({
  title: i18nT("pages.about.title"),
});
</script>
