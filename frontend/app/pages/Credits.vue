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
            スタッフ紹介
          </v-card-title>
          <v-card-subtitle class="text-caption mb-2">
          </v-card-subtitle>
    
          <v-card-text class="terms-content mt-3">
            <section class="mb-4">
              <h3 class="text-subtitle-2 font-weight-medium"><a href="https://wefma.net">ゑふまいか</a></h3>
              <ul class="pl-6">
                <li>開発</li>
                <li>サーバ管理</li>
                <li>運用管理</li>
              </ul>

              <h3 class="text-subtitle-2 font-weight-medium"><a href="https://x.com/kamoneko_nonaku">かも猫</a></h3>
              <ul class="pl-6">
                <li>開発委託</li>
              </ul>

              <h3 class="text-subtitle-2 font-weight-medium"><a href="https://info.puresign.tokyo">irckk</a></h3>
              <ul class="pl-6">
                <li>ドメイン管理</li>
                <li>運用</li>
              </ul>
            </section>
          </v-card-text>
        </v-card>

        <v-card
          elevation="4"
          :style="{
            alignItems: 'stretch',
            minHeight: '170px',
            minWidth: '0'
          }"
        >
          <v-card-title class="text-h6 font-weight-bold">
            使用したサードパーティ成果物
          </v-card-title>
          <v-card-subtitle class="text-caption mb-2">
          </v-card-subtitle>
    
          <v-card-text class="terms-content mt-3">
            <section class="mb-4">
              <h3 class="text-subtitle-2 font-weight-medium"><a href="https://www.silentselene.net/">silentselene.net</a>(Apache2.0ライセンス)</h3>
              <ul class="pl-6">
                <li>リプレイファイルパース定義</li>
              </ul>
            </section>
          </v-card-text>

        </v-card>
      </v-container>
    </v-main>
  </template>