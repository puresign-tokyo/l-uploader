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


      <ClientOnly>
      <v-dialog
        v-model="dialogSuccessPost"
        max-width="600"
        scrim="rgba(0, 0, 0, 0.5)"
      >
        <v-card
          class="elevation-0"
        >
          <v-card-title>リプレイを投稿しました</v-card-title>
          <v-container class="d-flex justify-center">
            <v-btn
              prepend-icon="mdi-twitter"
              color="blue darken-1"
              max-width="200"
              @click="shareToTweet"
            >Twitterでシェアする</v-btn>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="閉じる"
              variant="plain"
              @click="dialogSuccessPost = false"
            />
            
          </v-card-actions>

        </v-card>

      </v-dialog>
      </ClientOnly>
    
    </v-main>
      </template>
      
    <script setup>
        import { ClientOnly } from '#components'
        import { ref } from 'vue'
    
        const userName = ref('')
        const replayFile = ref(null)
        const uploadComment = ref('')
        const deletePassword = ref('')
        const dialogSuccessPost=ref(false)
        const pendingTweetText=ref('')
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
                    pendingTweetText.value=`
#黄昏酒場スコアボード に
支払金額が${response._data["score"]}円の
ファイル名が${response._data["replay_file_name"]}のリプレイを
投稿しました！

リプレイのダウンロードはこちらから！
${useRuntimeConfig().public.backend_url}/replays/${response._data["replay_id"]}/file

`
                    dialogSuccessPost.value=true
                  }
                }
              }
            )
           }catch(error){
             alert(`${error.statusCode};${error.statusMessage};${error.data.detail}`)
           }
    
        }

        const shareToTweet=()=>{
          const text=encodeURIComponent(pendingTweetText.value)
          const url=encodeURIComponent(`${window.location.origin}/`)
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)
          dialogSuccessPost.value=false
        }
    
      </script>