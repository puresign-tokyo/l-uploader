<template>
<v-main>
    <div class="pa-4 text-center">
      <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-account"
            text="Edit Profile"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>
  
        <v-card
          prepend-icon="mdi-account"
          title="User Profile"
          text="削除用パスワードを入力してください"
        >
          
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-text-field
                  label="First name*"
                  required
                ></v-text-field>
              </v-col>
  

            </v-row>
  
            <small class="text-caption text-medium-emphasis">*indicates required field</small>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              text="閉じる"
              variant="plain"
              @click="dialog = false"
            ></v-btn>
  
            <v-btn
              color="primary"
              text="削除"
              variant="tonal"
              @click="dialog = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</v-main>
  </template>
  
  <script setup>
    import { shallowRef } from 'vue'
  
    const dialog = shallowRef(false)
  </script>
  
  <script>
    export default {
      data: () => ({
        dialog: false,
      }),
    }
  </script>