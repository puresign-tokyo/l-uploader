<template>
  <v-main>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="pa-4" elevation="3" rounded="lg" max-width="800">
        <v-card-title class="text-h6 font-weight-bold">
          {{ i18nT("pages.terms_serve.template.terms_serve.title") }}
        </v-card-title>
        <v-card-subtitle class="text-caption mb-2">
          {{ i18nT("pages.terms_serve.template.terms_serve.subtitle") }}
        </v-card-subtitle>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article01.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article01.contents.lists.scope"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article01.contents.lists.only_japan"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article02.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article02.contents.lists.replay_post_enable"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article02.contents.lists.multi_post_enable"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article02.contents.lists.replay_store_limit"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article03.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article03.contents.lists.user_stores_password"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article03.contents.lists.delete_with_password"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article03.contents.lists.third_person_use_password"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article04.title"
                )
              }}
            </h3>
            <p>
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article04.contents.paragraph"
                )
              }}
            </p>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.illegal"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.crime"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.cyber_attack"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.obstruct_service"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.steal_personal_info"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.unauthorized_access"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.impersonation"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.anti_social"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.violation_of_rights"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.text"
                  )
                }}
                <ul class="pl-6">
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.lists.violence"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.lists.sexual"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.lists.discrimination"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.lists.suicide"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.posts_contents.lists.others"
                      )
                    }}
                  </li>
                </ul>
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.religion"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article04.contents.lists.others"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article05.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.conditions_of_service_stop.text"
                  )
                }}
                <ul class="pl-6">
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.conditions_of_service_stop.lists.maintenance"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.conditions_of_service_stop.lists.disaster"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.conditions_of_service_stop.lists.cyber_incident"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.conditions_of_service_stop.lists.others"
                      )
                    }}
                  </li>
                </ul>
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.user_disadvantage"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article05.contents.lists.service_end"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article06.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article06.contents.lists.enable_posts_replays"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article06.contents.lists.posts_info_rights"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article06.contents.lists.compatible_fun_work_guideline"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article07.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article07.contents.lists.disclaimer_of_warranties"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article07.contents.lists.user_damage"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article07.contents.lists.special_circumstance"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article07.contents.lists.user_and_third_person"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article08.title"
                )
              }}
            </h3>
            <p>
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article08.contents.paragraph"
                )
              }}
            </p>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article09.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article09.contents.lists.conditions_of_change_terms_serve.text"
                  )
                }}
                <ol class="pl-6">
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article09.contents.lists.conditions_of_change_terms_serve.lists.compatible_user_advantage"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article09.contents.lists.conditions_of_change_terms_serve.lists.rationality"
                      )
                    }}
                  </li>
                </ol>
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article09.contents.lists.press_release"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article10.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.store_personal_info_secure"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.personal_info_usecase.text"
                  )
                }}
                <ol class="pl-6">
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.personal_info_usecase.lists.operation"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.personal_info_usecase.lists.improve_service"
                      )
                    }}
                  </li>
                </ol>
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.exception_of_disclosure_personal_info.text"
                  )
                }}
                <ol class="pl-6">
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.exception_of_disclosure_personal_info.lists.users_consent"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.exception_of_disclosure_personal_info.lists.based_on_laws"
                      )
                    }}
                  </li>
                  <li>
                    {{
                      i18nT(
                        "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.exception_of_disclosure_personal_info.lists.emergency"
                      )
                    }}
                  </li>
                </ol>
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article10.contents.lists.disclosure_request"
                  )
                }}
              </li>
            </ol>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article11.title"
                )
              }}
            </h3>
            <p>
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article11.contents.paragraph"
                )
              }}
            </p>
          </section>
          <section>
            <h3 class="text-subtitle-2 font-weight-medium">
              {{
                i18nT(
                  "pages.terms_serve.template.terms_serve.sections.article12.title"
                )
              }}
            </h3>
            <ol class="pl-6">
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article12.contents.lists.governing_law"
                  )
                }}
              </li>
              <li>
                {{
                  i18nT(
                    "pages.terms_serve.template.terms_serve.sections.article12.contents.lists.mismatch_intentions"
                  )
                }}
              </li>
            </ol>
          </section>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
const { t: i18nT } = useI18n();

useHead({
  title: i18nT("pages.terms_serve.title"),
});
</script>

<style scoped>
.terms-content {
  overflow-y: auto;

  padding-right: 8px; /* スクロールバーのスペース */
  line-height: 1.6;
  font-size: 0.9rem;
}
</style>
