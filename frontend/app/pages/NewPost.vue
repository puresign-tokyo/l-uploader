<template>
  <v-main>
    <v-container class="d-flex justify-center">
      <v-card
        class="w-100"
        max-width="600"
        elevation="4"
        style="align-items: stretch; min-height: 170px;"
      >
        <v-card-title>新規投稿</v-card-title>
        <v-divider/>
        <v-card-text class="pa-4">

          <div class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center">
            <v-icon icon="mdi-file-outline"/>リプレイファイル
          </div>

          <v-row dense>
            <v-col
            cols="12"
            >
            <v-file-input
              v-model="replayFile"
              accept=".rpy"
              label="リプレイファイル(*.rpy)"
              :rules="[validateReplayFile]"
            ></v-file-input>
            </v-col>
          </v-row>


          <div class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center">
            <v-icon icon="mdi-information-outline"/>詳細情報
          </div>

          <v-row dense>
            <v-col
              cols="12"
            >
            <v-text-field
              v-model="userName"
              label="ユーザ名"
              required
              placeholder="ZUN"
              :rules="[validateUserName]"
              :counter="config.username_length_limit"
            ></v-text-field>
            </v-col>
          </v-row>         

          <v-row dense>
            <v-col
              cols="12"
            >
              <v-select
                label="プレイスタイル"
                v-model="categoryTag"
                :items="Object.keys(categoryTags)"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="optionalTag"
                label="タグ"
                placeholder="リプ会用"
                :rules="[validateOptionalTag]"
                :counter="config.optional_tag_length_limit"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col
              cols="12"
            >
            <v-textarea
              v-model="uploadComment"
              label="コメント"
              placeholder="頑張って達成しました！！"
              :rules="[validateUploadComment]"
              :counter="config.upload_comment_length_limit"
              rows="3"
            ></v-textarea>
            </v-col>
          </v-row>

      
          <v-subheader class="text-subtitle-1 font-weight-medium text-grey-darken-3 mb-4 mt-6 d-flex align-center">
            <v-icon icon="mdi-trash-can-outline" color="error"/>削除パスワード
          </v-subheader>
        
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="deletePassword"
                label="削除用パスワード"
                persistent-hint
                hint="必ず入力してください"
                required
                counter="60"
                :rules="[validateDeletePassword]"
                :type="showPassword ? 'text' : 'password'"
              >
                <template #append-inner>
                  <v-icon
                    :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="showPassword = !showPassword"
                    class="mr-2"
                    style="cursor: pointer;"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>

        
          
          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mt-8">
              <div v-if="config.recaptcha_enabled"
              class="g-recaptcha" :data-sitekey="config.recaptcha_sitekey"/>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mt-4">
              <v-btn
                color="primary"
                text="送信"
                variant="tonal"
                @click="sendPostReplay"
              ></v-btn>
            </v-col>
          </v-row>
          
        </v-card-text>
      </v-card>
    </v-container>


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
              text="ホーム画面に戻る"
              variant="plain"
              @click="router.push('/')"
            />
            
          </v-card-actions>

        </v-card>

      </v-dialog>
    </ClientOnly>
  
    <!-- スナックバー -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="outlined" @click="snackbar.visible = false">閉じる</v-btn>
      </template>
    </v-snackbar>

  </v-main>
</template>
      
<script setup>
  import { ClientOnly } from '#components'
  import { ref } from 'vue'

  const router = useRouter()

  const userName = ref('')
  const replayFile = ref(null)
  const uploadComment = ref('')
  const deletePassword = ref('')
  const categoryTag= ref('クリア')
  const optionalTag=ref('')

  const dialogSuccessPost=ref(false)
  const pendingTweetText=ref('')
  const showPassword=ref(false)

  const config=useRuntimeConfig().public

  let wasOpened = false

  const snackbar=ref({
    visible: false,
    message: '',
    color: 'success',
  })

  const categoryTags={
    'クリア': 'clear',
    'スコアアタック': 'score_run',
    'ノーボム': 'no_bomb',
    'ノーミス': 'no_miss',
    'その他': 'others'
  }

  const validateUserName=(value) => value.length<=config.username_length_limit || config.username_length_limit + '文字以内で入力してください'
  const validateUploadComment=(value) => value.length<=config.upload_comment_length_limit || config.upload_comment_length_limit + '文字以内で入力してください'
  const validateDeletePassword=(value) => value.length<=config.delete_password_length_limit || config.delete_password_length_limit + '文字以内で入力してください'
  const validateReplayFile=(value) => {
    if (!value) return true; // nullや未選択ならバリデーションOK
    if (value.size > config.filesize_kb_limit * 1024) {
      return 'ファイルサイズが大きすぎます';
    }
    return true;
  }
  const validateOptionalTag=(value) => value.length<=config.optional_tag_length_limit || config.optional_tag_length_limit + '文字以内で入力してください'

  onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })



  async function sendPostReplay() {
    if(userName.value===""){
      snackbar.value.visible=true
      snackbar.value.message='ユーザ名を入力してください'
      snackbar.value.color='error'
      return
    }
    if(userName.value.length>config.username_length_limit){
      snackbar.value.visible=true
      snackbar.value.message=`ユーザ名の${config.username_length_limit}文字数が文字以上です`
      snackbar.value.color='error'
      return
    }
    if(uploadComment.value.length>config.upload_comment_length_limit){
      snackbar.value.visible=true
      snackbar.value.message=`コメントの文字数が${config.upload_comment_length_limit}文字以上です`
      snackbar.value.color='error'
      return
    }
    if(replayFile.value===null){
      snackbar.value.visible=true
      snackbar.value.message="リプレイファイルを指定してください"
      snackbar.value.color='error'
      return
    }
    if(deletePassword.value.length>config.delete_password_length_limit){
      snackbar.value.visible=true
      snackbar.value.message=`パスワードの文字数が${config.delete_password_length_limit}文字以上です`
      snackbar.value.color='error'
      return
    }
    if(deletePassword.value===""){
      snackbar.value.visible=true
      snackbar.value.message="パスワードを入力してください"
      snackbar.value.color='error'
      return
    }

    let response = ""
    if (config.recaptcha_enabled){
      response = window.grecaptcha?.getResponse()
    }else{
      response = ""
    }
    if (config.recaptcha_enabled && !response) {
      snackbar.value.visible=true
      snackbar.value.message="reCAPTCHAを確認してください"
      snackbar.value.color='error'
      return
    }

    console.log(response)

    const formData = new FormData()
    formData.append('user_name', userName.value)
    formData.append('replay_file', replayFile.value)
    formData.append('upload_comment', uploadComment.value)
    formData.append('delete_password', deletePassword.value)
    formData.append('category',categoryTags[categoryTag.value])
    formData.append('optional_tag',optionalTag.value)
    formData.append('recaptcha_token',response)
    try{
      await $fetch(
        `${useRuntimeConfig().public.backend_url}/replays`,{
          method: 'post',
          body: formData,
          onResponse({response}){
            if(200<=response.status && response.status<300){
              replayFile.value=null
              uploadComment.value=''
              pendingTweetText.value=`#えるろだ に
リプレイを投稿しました！

詳細はこちらから！
${window.location.origin}/replays/${response._data["replay_id"]}

`
              dialogSuccessPost.value=true
            }
            snackbar.value.visible=true
            snackbar.value.message="リプレイを投稿しました"
            snackbar.value.color='success'
          }
        }
      )
      }catch(error){
        alert(`${error.statusCode};${error.statusMessage};${error.data.detail}`)
      }

  }

  watch(dialogSuccessPost, (val) => {
    if (val) {
      wasOpened = true
    } else if (wasOpened) {
      router.push('/')
    }
  })

  const shareToTweet=()=>{
    const text=encodeURIComponent(pendingTweetText.value)
    window.open(`https://twitter.com/intent/tweet?text=${text}`)
    dialogSuccessPost.value=false
    router.push('/')
  }

  </script>