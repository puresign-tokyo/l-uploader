<template>
  <v-main>
    <v-container class="d-flex flex-column justify-center">
      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0'
        }"
        class="mb-5"
      >
        <v-card-title class="text-h6 font-weight-bold">
          リリースノート
        </v-card-title>
        <v-divider/>
        <v-list two-line>
          <v-sheet
            v-for="(release, index) in releases"
            :key="index"
            class="mx-4 my-2 pa-4"
            color="grey-lighten-4"
            elevation="1"
            rounded
          >
            <v-list-subheader>
              {{ release.version }}（{{ release.date }}）
            </v-list-subheader>

            <v-list-item
              v-for="(item, i) in release.changes"
              :key="`${index}-${i}`"
            >
              <v-list-item-content>
                <v-list-item-title class="text-wrap">{{ item }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-sheet>
        </v-list>
      </v-card>
    </v-container>
  </v-main>
</template>
<script setup>
  import { Releases } from '~/composables/ReleaseNotes';
  const releases=ref({})
  releases.value=Releases()
</script>