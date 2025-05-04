<template>
  <v-main>
  <v-container>
    <p>このページは同人サークル『呑んべぇ会』が作成した『<a href="http://alcostg.amatukami.com/">黄昏酒場</a>』のスコアボードです</p>
  </v-container>

  <v-container>
    <v-sheet class="w-50">
      <v-select
        :items="sortCategories"
        v-model="selectedSortCategory"
        label="ソート順"
        @update:modelValue="selectSort"    
      />
    </v-sheet>
  </v-container>

  <ClientOnly>
    <v-container>
      <v-data-table
          :headers="headers[sortCategoriesMap[selectedSortCategory]]"
          :items="replaysTable"
          :loading="loading"
          loading-text="loading..."
      >

        <!-- 詳細表示 -->
        <template #[`item.detail`]="{item}">
          <v-icon
            icon="mdi-information-outline"
            variant="tonal"
            v-bind="activatorDetailProps"
            @click="openFocusedDialog(item)"
          />
        </template>

          <!-- ダウンロードリンク作成 -->
          <template #[`item.download`]="{item}">
              <a
                  :href="`${createDownloadLink(item.replay_id)}`"
              >{{item.replay_file_name}}</a>
          </template>

          <!-- 削除フォーム作成 -->
          <template #[`item.delete`]="{ item }">
            <v-icon
              class="text-none font-weight-regular"
              icon="mdi-trash-can-outline"
              variant="tonal"
              color="error"
              @click="openDeleteDialog(item)"
            />
          </template>

      </v-data-table>
    </v-container>

    <!-- 詳細ダイアログ -->
    <v-dialog
      v-model="detailDialog"
      max-width="600"
      scrim="rgba(0, 0, 0, 0.5)"
      attach="body"
    >
      <v-card class="elevation-0">
        <v-container>
          <v-list v-for="(item, index) in detailFields" :key="index">
            <v-list-item-subtitle class="custom-v-list-item-subtitle">{{item.label}}</v-list-item-subtitle>
            <v-list-item>
              <v-list-item-title class="custom-v-list-item-title">{{focusedItem[item.value]}}</v-list-item-title>
            </v-list-item>
          </v-list>
    
          <!-- ダウンロードリンク -->
          <v-list>
            <v-list-item-subtitle class="custom-v-list-item-subtitle">ダウンロードリンク</v-list-item-subtitle>
            <v-list-item>
              <v-list-item-title class="custom-v-list-item-title">
                <a :href="createDownloadLink(focusedItem['replay_id'])">
                  {{focusedItem['replay_file_name']}}
                </a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-container>
    
        <v-divider></v-divider>
    
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="閉じる" variant="plain" @click="detailDialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 削除ダイアログ -->
    <v-dialog
      v-model="dialog"
      max-width="600"
      scrim="rgba(0, 0, 0, 0.5)"
      attach="body"
    >
      <v-card
        :title="`${pendingDeleteItem?.replay_file_name ?? ''}を削除する`"
        text="削除用パスワードを入力してください"
        class="elevation-0"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="deletePassword"
                label="削除用パスワード"
                required
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
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
            color="error"
            text="削除"
            variant="tonal"
            @click="sendDeleteReplay"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </ClientOnly>


  <v-snackbar
    v-model="snackbar"
  >
    削除しました
    <template v-slot:actions>
      <v-btn
        color="success"
        variant="outlined"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

  </v-main>
</template>

<script setup>
import { ClientOnly } from '#components';
import {ref, onMounted, shallowRef, VueElement} from 'vue'

const replaysTable=ref([])
const loading=ref(true)
const pendingDeleteItem=ref()
const focusedItem=ref()
const deletePassword=ref("")
const snackbar=ref(false)
const showPassword=ref(false)
const sortCategories=['支払金額', 'プレイ時刻', '投稿時刻']
const selectedSortCategory=ref('支払金額')
const sortCategoriesMap={'支払金額':'score', 'プレイ時刻':'created_at', '投稿時刻':'uploaded_at'}

const headers={
'score':[
    {title: '順位', key: 'rank', sortable: false},
    {title: '支払い金額(円)', key: 'score', sortable: false},
    {title: 'ユーザ名', key: 'user_name', sortable: false},
    {title: 'プレイ時刻', key: 'created_at', sortable: false},
    {title: 'ダウンロード', key: 'download', sortable: false},
    {title: '', key: 'detail', sortable: false},
    {title: '', key: 'delete', sortable: false}
],
'created_at':[
    {title: 'プレイ時刻', key: 'created_at', sortable: false},
    {title: '支払い金額(円)', key: 'score', sortable: false},
    {title: 'ユーザ名', key: 'user_name', sortable: false},
    {title: 'ダウンロード', key: 'download', sortable: false},
    {title: '', key: 'detail', sortable: false},
    {title: '', key: 'delete', sortable: false}
],
'uploaded_at':[
    {title: '投稿時刻', key: 'uploaded_at', sortable: false},
    {title: '支払い金額(円)', key: 'score', sortable: false},
    {title: 'ユーザ名', key: 'user_name', sortable: false},
    {title: 'プレイ時刻', key: 'created_at', sortable: false},
    {title: 'ダウンロード', key: 'download', sortable: false},
    {title: '', key: 'detail', sortable: false},
    {title: '', key: 'delete', sortable: false}
]
}

const detailFields=[
  {label: 'ユーザ名', value: 'user_name'},
  {label: 'リプレイ名', value: 'replay_name'},
  {label: '支払金額', value: 'score'},
  {label: 'ステージ', value: 'stage'},
  {label: '処理落ち率', value: 'slow_rate'},
  {label: 'ゲームバージョン', value: 'game_version'},
  {label: 'プレイ日付', value: 'created_at'},
  {label: '投稿日付', value: 'uploaded_at'},
  {label: 'コメント', value: 'upload_comment'}
]

const dialog = ref(false)
const detailDialog =ref(false)



const formatDate=(isoString)=>{
const formatter=new Intl.DateTimeFormat('ja-JP',{
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})
return formatter.format(new Date(isoString))
}

function createDownloadLink(replayId){
return `${useRuntimeConfig().public.backend_url}/replays/${replayId}/file`
}

await useFetch(
  `${useRuntimeConfig().public.backend_url}/replays?sort=score&order=desc&offset=0&limit=1000`,{
    server: false,
    onResponse({response}){
      loading.value=false
      const rawData=response._data
      replaysTable.value = rawData.map((item, index) => ({
        ...item,
        rank: index + 1,
        created_at: formatDate(item.created_at),
        uploaded_at: formatDate(item.uploaded_at),
      }))
    },
    onResponseError({error}){
      loading.value=false
      replaysTable.value=[]
      console.error(error)
    }
  }
)

function openDeleteDialog(item){
  pendingDeleteItem.value=item
  dialog.value=true
}

function openFocusedDialog(item){
  focusedItem.value=item
  detailDialog.value=true
}

async function selectSort(){
  const sortQuery=sortCategoriesMap[selectedSortCategory.value]
  loading.value=true
 try{
    const data=await $fetch(
      `${useRuntimeConfig().public.backend_url}/replays?sort=${sortQuery}&order=desc&offset=0&limit=1000`,{
        server: false,
        onResponse({response}){
          if(200<=response.status && response.status<300){
            loading.value=false
            const rawData=response._data
            replaysTable.value = rawData.map((item, index) => ({
              ...item,
              rank: index + 1,
              created_at: formatDate(item.created_at),
              uploaded_at: formatDate(item.uploaded_at),
            }))
          }
        },
      }
    )
 }catch(error){
   alert(`${error.statusCode};${error.statusMessage};${error.data.detail}`)
   console.error(error)
  }
}

async function  sendDeleteReplay(){
  try{
    const data = await $fetch(
      `${useRuntimeConfig().public.backend_url}/replays/${pendingDeleteItem.value.replay_id}`,{
        server: false,
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: { 'delete_password': deletePassword.value},
        onResponse({response}){
          if ( 200<=response.status && response.status<300 ){
            dialog.value=false
            snackbar.value=true
            replaysTable.value=replaysTable.value.filter((t)=>t.replay_id !== pendingDeleteItem.value.replay_id)
          }
        },
      }
    )
  }catch(error){
    if(error.data.detail=='password mismatch'){
      alert("パスワードが違います")
    }else{
      alert(`${error.statusCode};${error.statusMessage};${error.data.detail}`)
    }
  }
}

</script>



<style scoped>
.custom-v-list-item-subtitle{
  font-size: 0.75rem;
}
.custom-v-list-item-title{
  white-space: normal;
  text-overflow: unset;
  overflow-wrap: break-word;
  word-break: break-word;
}
.v-data-table{
  white-space: nowrap;
}
</style>