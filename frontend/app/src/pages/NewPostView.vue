<template>
<v-main>
    <v-card-text>
    <v-row dense>
        <v-col
        cols="12"
        md="4"
        sm="6"
        >
        <v-text-field
            v-model="userName"
            label="ユーザ名"
            required
            placeholder="ZUN"
            :rules="[validateUserName]"
            counter="30"
        ></v-text-field>
        </v-col>
    </v-row>         
    </v-card-text>

    <v-cart-text>
    <v-row dense>
        <v-col
        cols="12"
        md="4"
        sm="6"
        >
        <v-file-input v-model="replayFile" accept=".rpy" label="リプレイファイル(*.rpy)"></v-file-input>
        </v-col>
    </v-row>
    </v-cart-text>

    <v-card-text>
    <v-row dense>
        <v-col
        >
        <v-text-field
            v-model="uploadComment"
            label="コメント"
            placeholder="頑張って達成しました！！"
            :rules="[validateUploadComment]"
            counter="300"
        ></v-text-field>
        </v-col>
    </v-row>
    </v-card-text>

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
            persistent-hint
            hint="必ず入力してください"
            required
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
        ></v-text-field>
        </v-col>
    </v-row>
    </v-card-text>

    <v-btn
        color="primary"
        text="送信"
        variant="tonal"
        @click="sendPostReplay"
    ></v-btn>

    <v-snackbar
      v-model="snackbar"
    >
      送信しました
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
    import { ref } from 'vue'
    // import { FormData } from 'form-data'
    import axios from 'axios'


    const userName = ref('')
    const replayFile = ref(null)
    const uploadComment = ref('')
    const deletePassword = ref('')
    const snackbar=ref(false)
    
    const showPassword=ref(false)

    const validateUserName=(value) => value.length<=30 || '30文字以内で入力してください'
    const validateUploadComment=(value) => value.length<=300 || '300文字以内で入力してください'

    async function sendPostReplay() {
      if(userName.value===""){
        alert("ユーザ名を入力してください")
        return
      }
      if(userName.value.length>30){
        alert("ユーザ名の文字数が30文字以上です")
        return
      }
      if(uploadComment.value.length>300){
        alert("コメントの文字数が300文字以上です")
        return
      }
      if(replayFile.value===null){
        alert("リプレイファイルを指定してください")
        return
      }
      if(deletePassword.value===""){
        alert("パスワードを入力してください")
        return
      }
      const formData = new FormData()
      formData.append('user_name', userName.value)
      formData.append('replay_file', replayFile.value)
      formData.append('upload_comment', uploadComment.value)
      formData.append('delete_password', deletePassword.value)
      try{
        await axios.post(
          `${process.env.VUE_APP_HTTP_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/replays`,
          formData,
          {headers: { 'Content-Type': 'multipart/form-data' }})
        replayFile.value=null
        uploadComment.value=''
        snackbar.value=true
      }catch(error){
        alert(error.message)
      }

    }

  </script>