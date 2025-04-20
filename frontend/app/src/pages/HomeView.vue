<template>
    <v-main>
    <div class="my-5">
      <h1>大吞みチャンピオン一覧</h1>
    </div>

    <v-sheet class="w-50">
      <v-select
        :items="sortCategories"
        v-model="selectedSortCategory"
        label="ソート順"
        @update:modelValue="selectSort"
      />
    </v-sheet>

    <v-data-table
        :headers="headers[sortCategoriesMap[selectedSortCategory]]"
        :items="replaysTable"
        :loading="loading"
        loading-text="loading..."
    >

      <!-- 詳細表示 -->
      <template #[`item.detail`]="{item}">
        <v-dialog
          v-model="detailDialog"
          max-width="600"
          overlay-opacity="0.5"
        >
        <template v-slot:activator="{ props: activatorDetailProps }">
          <v-icon
            icon="mdi-information-outline"
            variant="tonal"
            v-bind="activatorDetailProps"
            @click="openFocusedDialog(item)"
          />
        </template>
  
        <v-card>
          
          <v-container>
            <v-list v-for="(item, index) in detailFields" :key="index">
              <v-list-item-subtitle class="custom-v-list-item-subtitle">{{item.label}}</v-list-item-subtitle>
              <v-list-item>
                <v-list-item-title class="custom-v-list-item-title">{{focusedItem[item.value]}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-container>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              text="閉じる"
              variant="plain"
              @click="detailDialog = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </template>

        <!-- ダウンロードリンク作成 -->
        <template #[`item.download`]="{item}">
            <a
                :href="`${createDownloadLink(item.replay_id)}`"
            >{{item.replay_file_name}}</a>
        </template>

        <!-- 削除フォーム作成 -->
        <template #[`item.delete`]="{item}">
            <v-dialog
        v-model="dialog"
        max-width="600"
      >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:activator="{ props: activatorProps }">
          <v-icon
            class="text-none font-weight-regular"
            icon="mdi-trash-can-outline"
            variant="tonal"
            v-bind="activatorProps"
            color="error"
            @click="openDeleteDialog(item)"
          ></v-icon>
        </template>
  
        <v-card
          :title="`${pendingDeleteItem.replay_file_name}を削除する`"
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
        </template>

    </v-data-table>

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
import {ref, onMounted, shallowRef} from 'vue'
import axios from 'axios'

const replaysTable=ref([])
const loading=ref(true)
const pendingDeleteItem=ref()
const focusedItem=ref()
const deletePassword=ref()
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
      {title: 'ダウンロード', key: 'download', sortable: false},
      {title: '', key: 'detail', sortable: false},
      {title: '', key: 'delete', sortable: false}
  ]
}

const detailFields=[
  {label: 'リプレイファイル名', value: 'replay_file_name'},
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
  
const dialog = shallowRef(false)
const detailDialog =shallowRef(false)

const formatDate=(isoString)=>{
  const date=new Date(isoString)
  const pad = (n) => n.toString().padStart(2,'0')
  return `${date.getFullYear()}年 ${pad(date.getMonth()+1)}月 ${pad(date.getDate())}日 ${pad(date.getHours())}時 ${pad(date.getMinutes())}分 ${pad(date.getSeconds())}秒`
}

function createDownloadLink(replayId){
  return `${process.env.VUE_APP_HTTP_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/replays/${replayId}/file`
}

onMounted(async ()=>{
  try {
    const response = await axios.get(`${process.env.VUE_APP_HTTP_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/replays?sort=score&order=desc&offset=0&limit=1000`);
    const ranked = response.data.map((item, index) =>({
        ...item,
        rank: index+1,
        created_at: formatDate(item.created_at),
        uploaded_at: formatDate(item.uploaded_at)
    }))
    replaysTable.value = ranked
  } catch (error) {
    console.error('エラー:', error);
  } finally{
    loading.value=false
  }
})

function openDeleteDialog(item){
    pendingDeleteItem.value=item
}

function openFocusedDialog(item){
  focusedItem.value=item
}

async function selectSort(){
  //変数代入しないとうまくURLが作成されない
  const sortQuery = sortCategoriesMap[selectedSortCategory.value]
  try {
    const response = await axios.get(`${process.env.VUE_APP_HTTP_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/replays?sort=${sortQuery}&order=desc&offset=0&limit=1000`);
    const ranked = response.data.map((item, index) =>({
        ...item,
        rank: index+1,
        created_at: formatDate(item.created_at),
        uploaded_at: formatDate(item.uploaded_at)
    }))
    replaysTable.value = ranked
  } catch (error) {
    console.error('エラー:', error);
  } finally{
    loading.value=false
  }
}

async function sendDeleteReplay(){
    const data={
        delete_password: deletePassword.value
    };
    try{
        await axios.delete(`${process.env.VUE_APP_HTTP_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/replays/${pendingDeleteItem.value.replay_id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
    
        dialog.value=false
        snackbar.value=true
        replaysTable.value=replaysTable.value.filter((t)=>t.replay_id !== pendingDeleteItem.value.replay_id)

    }catch(error){
        if(error.response && error.response.status===400 && error.response.data.detail==="password mismatch"){
            alert("パスワードが間違っています")
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