<template>
  <q-page padding>
    <div class="LoginContent">
      <h5 class="MainTitle">註冊</h5>
      <div class="inputContent">
        <div class="inputGroup">
          <div class="text-subtitle1">電子郵件</div>
          <q-input color="warning" v-model="account" rounded outlined />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">手機號碼</div>
          <q-input color="warning" v-model="phoneNum" rounded outlined>
            <template v-slot:before>
              <q-select outlined v-model="phoneCode" :options="phoneCodeOptions">
                <template v-slot:prepend>
                  <q-avatar>
                    <img v-bind:src="'src/assets/currency/' + phoneCode.url">
                  </q-avatar>
                </template>
              </q-select>
            </template>

          </q-input>
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">密碼</div>
          <q-input color="warning" v-model="password" :type="isPwd ? 'password' : 'text'" rounded outlined>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">確認密碼</div>
          <q-input color="warning" v-model="confirmPassword" :type="isConfirmPwd ? 'password' : 'text'" rounded outlined>
            <template v-slot:append>
              <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd" />
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
      <div class="checkTerms">
        <q-list>
          <q-item tag="label" manual-focus v-ripple="{ color: 'warning' }">
            <q-item-section avatar>
              <q-checkbox color="warning" v-model="right" />
            </q-item-section>
            <q-item-section>
              <q-item-label>我已閱讀並且同意 數位鎏金融服務的 <a href="#">服務條款</a></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="BtnGroup">
        <q-btn color="warning" text-color="black" label="註冊" to="/Merchant" size="lg" rounded />
        <div class="SeparatorTxt">
          <span class="line"></span>
          <span class="text">or</span>
          <span class="line"></span>
        </div>
        <q-btn color="black" text-color="white" label="登入" to="/Login" size="lg" rounded />
      </div>

    </div>

  </q-page>
</template>

<script>
import { ref } from "vue";
import Sidentify from "/src/utils/identify.vue"

export default {
  name: "RegisterPage",
  components: {
    Sidentify
  },
  data() {
    return {
      identifyCode: "", //密碼登入圖形驗證碼
      identifyCodes: "1234567890abcdefghizklmnopqrstuvwxyz", //生成圖形驗證碼依據
    }
  },
  setup() {

    const phoneFlag = ref('src/assets/currency/Flag_Tw.svg')

    return {
      account: ref(""),
      //phoneCodeOptions: ['+886', '+86', '+1', '+81'],
      //phoneCode: ref('+886'),
      phoneCodeOptions: [
        {
          code: '+886',
          url: 'Flag_Tw.svg'
        }, {
          code: '+86',
          url: 'Flag_Cn.svg'
        }, {
          code: '+1',
          url: 'Flag_US.svg'
        }, {
          code: '+81',
          url: 'Flag_JP.svg'
        }
      ],
      phoneCode: ref({
        code: '+886',
        url: 'Flag_Tw.svg'
      }),
      phoneNum: ref(""),
      password: ref(""),
      isPwd: ref(true),
      confirmPassword: ref(""),
      isConfirmPwd: ref(true),
      verify: ref(""),
      phoneFlag,
      right: ref(false)
    }
  },
  methods: {
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
    },
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

.checkTerms
  display: flex
  justify-content: center

  a
    color: #fcb335

</style>
