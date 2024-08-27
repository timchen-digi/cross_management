<template>

  <q-page padding>
    <div class="LoginContent">
      <h5 class="MainTitle">登入</h5>
      <div class="inputContent">
        <div class="inputGroup">
          <div class="text-subtitle1">電子郵件 或 手機號碼</div>
          <q-input color="warning" v-model="account" rounded outlined />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">密碼</div>
          <q-input color="warning" v-model="password" :type="isPwd ? 'password' : 'text'" rounded outlined>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="inputGroup VerificationCode">
          <div class="text-subtitle1 Title">驗證碼</div>
          <q-input v-model="verify" bottom-slots rounded outlined>
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

        <q-btn color="warning" text-color="black" label="登入" @click="login" size="lg" rounded />
        <div class="SeparatorTxt">
          <span class="line"></span>
          <span class="text">or</span>
          <span class="line"></span>
        </div>
        <q-btn color="black" text-color="white" label="註冊" to="/Login/Register" size="lg" rounded />

      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from "vue";
import Sidentify from "/src/utils/identify.vue"
import { getSHA256Hash } from 'src/utils/index.js'
import { useUserStore } from "../stores";
import { api } from 'boot/axios'

export default {
  name: "LoginPage",
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
        return;
      }
      var username = "";
      var isAdmin = false;
      var token = "";
      var merchantId = "";
      //登入驗證
      getSHA256Hash(this.password).then(hashPwd => {
        //console.log(hashPwd)
        api.post('/Auth/Login', {
          Account: this.account,
          Password: hashPwd,
        }).then(response => {
          console.log(response);
          const authStore = useUserStore();
          if (response.data.completeFlag == true) {
            // 成功登入
            var user = response.data.records[0];
            console.log(user);
            merchantId = user.MerchantId;
            authStore.setUserState(user);
          }
          else {
            alert("使用者名稱或密碼錯誤");
            return;
          }
          // 登入成功後導航至其他頁面
          this.$router.push("/Management/History");
        }).catch(function (error) {
          // handle error
          console.log(error);
          alert("使用者名稱或密碼錯誤");
        })
      });
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
  }
};
</script>

<style lang="sass">
.LoginContent
  max-width: 600px
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

.BtnGroup
  margin-top: 40px

  .q-btn
    width: 100%

.VerificationCode

  .Title
    width: 100%

  .refresh
    cursor: pointer

  canvas
    vertical-align: sub

</style>
