<template>
  <q-banner class="full-width-banner mainbanner">
    <div class="banner-content text-center text-white">
      <h4 class="q-my-sm">數位鎏商戶申請進度查詢</h4>
    </div>
  </q-banner>
  <q-page padding>
    <div class="PreContent">

      <div class="q-my-lg">
        <h5 class="MainTitle">註冊進度查詢&資料更新</h5>
        <div class="inputContent">
          <div class="inputGroup">
            <div class="text-subtitle1">請輸入統一編號或身分證字號</div>
            <q-input color="warning" v-model="account" rounded outlined placeholder="申請時使用的商家統編" />
          </div>
          <div class="inputGroup">
            <div class="text-subtitle1">請輸入申請pin碼</div>
            <q-input color="warning" v-model="password" rounded outlined placeholder="申請時使用的商家pin碼" />
          </div>
        </div>

        <div class="checkTerms">
          <div class="inputGroup VerificationCode">
            <div class="text-subtitle1 Title">驗證碼</div>
            <q-input v-model="verify" bottom-slots rounded outlined dense style="max-width: 400px;">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0"></div>
              </template>
              <template v-slot:after>
                <Sidentify :identifyCode="identifyCode" />
                <q-icon class="refresh" name="refresh" @click="refreshIdentifyCode" size="md" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="BtnGroup">
          <q-btn color="warning" text-color="black" label="查詢" @click="login" size="lg" rounded />
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>

import { ref } from "vue";
import Sidentify from "/src/utils/identify.vue"
// import { getSHA256Hash } from 'src/utils/index.js'
// import { useUserStore } from "../stores";
// import { api } from 'boot/axios'

export default {
  name: "CheckRegisterPage",
  components: {
    Sidentify
  },
  data() {
    return {
      identifyCode: "", //密碼登入圖形驗證碼
      identifyCodes: "23456789abcdefghjkmnpqrstuvwxyz", //生成圖形驗證碼依據
      account: "",
      password: "",
      isPwd: ref(true),
      verify: ""
    }
  },
  methods: {
    login() {
      //圖形驗證碼
      if (this.identifyCode != this.verify) {
        alert("驗證碼錯誤");
        this.refreshIdentifyCode()
        this.verify = ""
        return;
      }
      var merchantId = "";
      // 發API查詢是否有預註冊資料

      // 把結果存起來

    },
    // 刷新验证码
    refreshIdentifyCode() {
      this.identifyCode = "";
      this.makeIdentifyCode(4);
    },
    // 生成4位数的随机验证码
    makeIdentifyCode(l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    // 生成单个验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }
  },
  mounted() {
    // 初始化验证码
    this.identifyCode = "";
    this.makeIdentifyCode(4);
  },
  setup() {
    return {
      step: ref(1)
    }
  }
};
</script>

<style lang="sass">
.mainbanner
  width: 100%
  height: 300px
  background: url('common/mainbanner.jpg')

.PreContent
  max-width: 1000px
  margin: 0 auto

  .MainTitle
    position: relative
    display: flex
    align-items: center
    margin: 0 0 2rem 0
    padding-left: 10px

  .MainTitle:before
    display: inline-block
    content: ""
    width: 4px
    height: 25px
    background: #ffc107
    position: absolute
    left: 0

  .inputContent
    margin: 30px 0

    .inputGroup
      margin-bottom: 1rem

.SeparatorTxt
  width: 100%
  height: 40px
  display: flex
  justify-content: space-between
  align-items: center
  margin: 10px auto

  .line
    height: 2px
    flex-grow: 1
    background-color: #dfdfdf

  .text
    margin: 0 5px

.checkTerms
  display: grid
  justify-content: center

.BtnGroup
  display: flex
  margin-top: 40px
  justify-content: center

  .q-btn
    width: 100%
    max-width: 400px

.VerificationCode

  .Title
    width: 100%

  .refresh
    cursor: pointer

  canvas
    vertical-align: sub

</style>
