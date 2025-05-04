<template>
    <v-main>
      <v-card>
        <v-card-title>新規投稿</v-card-title>
        <v-divider></v-divider>
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
      
          <v-row dense>
              <v-col
              cols="12"
              md="4"
              sm="6"
              >
              <v-file-input
                v-model="replayFile"
                accept=".rpy"
                label="リプレイファイル(*.rpy)"
                :rules="[validateReplayFile]"
              ></v-file-input>
              </v-col>
          </v-row>
      
          <v-row dense>
              <v-col
              >
              <v-textarea
                v-model="uploadComment"
                label="コメント"
                placeholder="頑張って達成しました！！"
                :rules="[validateUploadComment]"
                counter="300"
                rows="3"
              ></v-textarea>
              </v-col>
          </v-row>
      
          
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
            counter="60"
            :rules="[validateDeletePassword]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          </v-col>
        
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-row dense>
              <v-btn
                color="primary"
                text="送信"
                variant="tonal"
                @click="sendPostReplay"
              ></v-btn>
              </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
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
    
        const userName = ref('')
        const replayFile = ref(null)
        const uploadComment = ref('')
        const deletePassword = ref('')
        const snackbar=ref(false)
        
        const showPassword=ref(false)
    
        const validateUserName=(value) => value.length<=30 || '30文字以内で入力してください'
        const validateUploadComment=(value) => value.length<=300 || '300文字以内で入力してください'
        const validateDeletePassword=(value) => value.length<=60 || '60文字以内で入力してください'
        const validateReplayFile=(value) => value && value.size<=200*1024 || 'ファイルサイズが大きすぎます'
        
    
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
            await $fetch(
              `${useRuntimeConfig().public.backend_url}/replays`,{
                method: 'post',
                body: formData,
                onResponse({response}){
                  if(200<=response.status && response.status<300){
                    replayFile.value=null
                    uploadComment.value=''
                    snackbar.value=true
                  }
                }
              }

            )
          }catch(error){
            alert(`${error.statusCode};${error.statusMessage};${error.data.detail}`)
          }
    
        }
    
      </script>