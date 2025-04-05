<template>
    <v-main>
    <div>
      <h1>大吞みチャンピオン一覧</h1>
    </div>
    <v-data-table
        :headers="headers"
        :items="replaysTable"
        :loading="loading"
        loading-text="loading..."
    >

        <!-- ダウンロードリンク作成 -->
        <template #item.download="{item}">
            <a
                :href="`http://board02.alcostg.web.wefma.net:5002/replays/${item.replay_id}/file`"
            >{{item.replay_file_name}}</a>
        </template>

        <!-- 削除フォーム作成 -->
        <template #item.delete="{item}">
            <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            text="削除"
            variant="tonal"
            v-bind="activatorProps"
            color="error"
            @click="openDeleteDialog(item)"
          ></v-btn>
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
const deletePassword=ref()
const snackbar=ref(false)

const headers=[
    {title: '順位', key: 'rank', sortable: false},
    {title: '支払い金額(円)', key: 'score', sortable: false},
    {title: 'ユーザ名', key: 'user_name', sortable: false},
    {title: 'コメント', key: 'upload_comment', sortable: false},
    {title: 'ダウンロード', key: 'download', sortable: false},
    {title: '削除', key: 'delete', sortable: false}
]

  
  const dialog = shallowRef(false)

onMounted(async ()=>{
    try {
    const response = await axios.get('http://board02.alcostg.web.wefma.net:5002/replays?sort=score&order=desc&offset=0&limit=1000');
    const ranked = response.data.map((item, index) =>({
        ...item,
        rank: index+1
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
    console.log(pendingDeleteItem)
}

async function sendDeleteReplay(){
    const data={
        delete_password: deletePassword.value
    };
    try{
        const response = await axios.delete(`http://board02.alcostg.web.wefma.net:5002/replays/${pendingDeleteItem.value.replay_id}`, {
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