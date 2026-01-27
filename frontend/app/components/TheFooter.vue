<template>
  <v-footer color="surface-light" class="mt-auto">
    <v-container
      class="d-flex align-center justify-center"
      style="height: 60px;footer-fixed"
    >
      <I18nT keypath="components.the_footer.template.contents.text" tag="p">
        <template #project_puresign>
          <a
            href="https://www.puresign.tokyo"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{
              i18nT(
                "components.the_footer.template.contents.tags.project_puresign"
              )
            }}
          </a>
        </template>
      </I18nT>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
import { I18nT, useI18n } from "vue-i18n";
const { t: i18nT } = useI18n();
</script>
