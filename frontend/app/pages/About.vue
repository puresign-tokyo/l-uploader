<template>
  <v-main>
    <v-container class="d-flex flex-column justify-center">
      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
        id="explain-replay-path"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          リプレイファイルの場所
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">星蓮船までの作品</h3>
            <p>次のいずれか</p>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>ゲーム内の<v-code>replay</v-code>フォルダ</li>
              <li>
                <v-code>
                  C:\Users\(ユーザー名)\AppData\Local\VirtualStore
                </v-code>
              </li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              ダブルスポイラー以降
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>
                <v-code>
                  C:\Users\(ユーザー名)\AppData\Roaming\ShanghaiAlice
                </v-code>
              </li>
            </ul>
            <p>
              ただしAppDataフォルダは隠しフォルダのため、
              <v-code>Windows 隠しフォルダ 表示</v-code>
              等で調べて表示できるようにしておくこと
            </p>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          対応作品一覧
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">整数作品</h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>東方紅魔郷 〜 the Embodiment of Scarlet Devil.</li>
              <li>東方妖々夢 〜 Perfect Cherry Blossom.</li>
              <li>東方永夜抄 ～ Imperishable Night.</li>
              <li>東方花映塚 〜 Phantasmagoria of Flower View.</li>
              <li>東方風神録 〜 Mountain of Faith.</li>
              <li>東方地霊殿 〜 Subterranean Animism.</li>
              <li>東方星蓮船 〜 Undefined Fantastic Object.</li>
              <li>東方神霊廟 〜 Ten Desires.</li>
              <li>東方輝針城 〜 Double Dealing Character.</li>
              <li>東方紺珠伝 〜 Legacy of Lunatic Kingdom.</li>
              <li>東方天空璋 〜 Hidden Star in Four Seasons.</li>
              <li>東方鬼形獣 〜 Wily Beast and Weakest Creature.</li>
              <li>東方虹龍洞 〜 Unconnected Marketeers.</li>
              <li>東方錦上京 〜 Fossilized Wonders.</li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">小数作品</h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>東方文花帖 〜 Shoot the Bullet.</li>
              <li>ダブルスポイラー 〜 東方文花帖</li>
              <li>妖精大戦争 〜 東方三月精</li>
              <li>弾幕アマノジャク 〜 Impossible Spell Card.</li>
              <li>秘封ナイトメアダイアリー 〜 Violet Detector.</li>
            </ul>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">その他</h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>黄昏酒場 ～Uwabami Breakers～</li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          ライセンス
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">ソースコード</h3>
            <p>
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                >Apache License 2.0
              </a>
              にて
              <a
                href="https://github.com/puresign-tokyo/l-uploader"
                target="_blank"
                rel="noopener noreferrer"
                >Github
              </a>
              で公開されています。
            </p>
          </section>
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">ロゴ</h3>
            <p>OMに依頼して作成しています。</p>
            <p>ユーザのロゴの改変を禁じます。</p>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          スタッフ紹介
        </v-card-title>

        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              <a
                href="https://wefma.net"
                target="_blank"
                rel="noopener noreferrer"
                >ゑふまいか</a
              >
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>開発</li>
              <li>サーバ管理</li>
              <li>運用管理</li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <a
                href="https://info.puresign.tokyo"
                target="_blank"
                rel="noopener noreferrer"
                >irckk</a
              >
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>ドメイン管理</li>
              <li>運用</li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <a
                href="https://x.com/kamoneko_nonaku"
                target="_blank"
                rel="noopener noreferrer"
                >かも猫</a
              >
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>開発委託</li>
            </ul>

            <h3 class="text-subtitle-1 font-weight-medium mt-4">
              <p>OM</p>
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>ロゴ作成</li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          使用した主なサードパーティ成果物
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <h3 class="text-subtitle-1 font-weight-medium">
              <a
                href="https://www.silentselene.net/"
                target="_blank"
                rel="noopener noreferrer"
                >silentselene.net</a
              >
              (Apache License 2.0)
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>リプレイファイルパース定義</li>
            </ul>
            <h3 class="text-subtitle-1 font-weight-medium">
              <a
                href="https://pypi.org/project/tsadecode/"
                target="_blank"
                rel="noopener noreferrer"
                >tsadecode</a
              >
              (パブリックドメイン)
            </h3>
            <ul class="pl-6 text-body-1" style="line-height: 1.8">
              <li>リプレイファイルデコーダ</li>
            </ul>
          </section>
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        :style="{
          alignItems: 'stretch',
          minHeight: '170px',
          minWidth: '0',
        }"
        class="mb-5 px-6"
      >
        <v-card-title class="text-h5 font-weight-bold px-0">
          寄付
        </v-card-title>
        <v-divider />

        <v-card-text class="terms-content mt-3">
          <section class="mb-4">
            <p>このサイトはゑふまいかの家の電気代によって成り立っています。</p>
            <p>
              <a
                href="https://ofuse.me/wefmaika"
                target="_blank"
                rel="noopener noreferrer"
                >ここ</a
              >からゑふまいかに寄付を送ることができます。
            </p>
          </section>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>
