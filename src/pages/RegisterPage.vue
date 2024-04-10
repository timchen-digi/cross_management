<template>
  <q-page padding>
    <div class="LoginContent">
      <h5 class="MainTitle">商戶申請</h5>
      <div class="text-subtitle1">登記類別</div>
       <div class="inputContent">
      <q-btn-toggle
        glossy
        v-model="group"
        toggle-color="primary"
        :options="tax_option"
      />
    </div>
      <div class="inputContent">
        <div class="inputGroup">
          <div class="text-subtitle1">{{tax_option.find((e)=>e.value===group).slot}}</div>
          <q-input color="warning" v-model="UBN" rounded outlined  placeholder="請輸入完整之統一編號，共八位數" />
        </div>
          <div class="inputGroup">
          <div class="text-subtitle1">{{tax_option.find((e)=>e.value===group).ext_data}}</div>
          <q-input color="warning" v-model="regName" rounded outlined placeholder="合約簽訂公司名" />
        </div>
          <div class="inputGroup">
          <div class="text-subtitle1">營業名稱</div>
          <q-input color="warning" v-model="businessName" rounded outlined placeholder="顯示予付款用戶的商店名稱" />
        </div>
          <div class="inputGroup">
          <div class="text-subtitle1">{{tax_option.find((e)=>e.value===group).ext_data2}}</div>
          <q-input color="warning" v-model="address" rounded outlined/>
        </div>
          <div class="inputGroup">
          <div class="text-subtitle1">聯絡人</div>
          <q-input color="warning" v-model="name" rounded outlined/>
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">電子郵件</div>
          <q-input color="warning" v-model="account" rounded outlined  placeholder="登入驗證碼將發送至此信箱" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">連絡電話</div>
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
        <div class="q-pa-md">
          <div class="text-subtitle1">欲開通支付方式</div>
          <div class="q-gutter-sm">
              <q-checkbox v-model="payment_select" val="P1" label="超商代收" />
              <q-checkbox v-model="payment_select" val="P2" label="街口支付" />
              <q-checkbox v-model="payment_select" val="P3" label="LINE Pay一卡通" />
            </div>
            <div class="q-gutter-sm">
              <q-checkbox v-model="payment_select" val="P4" label="Apple Pay" />
              <q-checkbox v-model="payment_select" val="P5" label="全支付電子支付" />
              <q-checkbox v-model="payment_select" val="P8" label="全盈支付+" />
            </div>
            <div class="q-gutter-sm">
              <q-checkbox v-model="payment_select" val="P7" label="微信支付平台(富邦)" />
              <q-checkbox v-model="payment_select" val="P9" label="電信代收" />
              <q-checkbox v-model="payment_select" val="P10" label="信用卡" />
          </div>
          <div class="q-gutter-sm">
              <q-checkbox v-model="payment_select" val="P11" label="銀行虛擬帳戶" />
            </div>
            <div class="q-gutter-sm">

          </div>
        </div>
        <!-- <div class="inputGroup">
          <div class="text-subtitle1">密碼</div>
          <q-input color="warning" v-model="password" :type="isPwd ? 'password' : 'text'" rounded outlined>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div> -->
        <!-- <div class="inputGroup">
          <div class="text-subtitle1">確認密碼</div>
          <q-input color="warning" v-model="confirmPassword" :type="isConfirmPwd ? 'password' : 'text'" rounded outlined>
            <template v-slot:append>
              <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd" />
            </template>
          </q-input>
        </div> -->
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
        <q-btn color="warning" text-color="black" label="註冊" size="lg" rounded @click="regClick" />
        <!-- <div class="SeparatorTxt">
           <span class="line"></span>
          <span class="text">or</span>
          <span class="line"></span>
        </div>
        <q-btn color="black" text-color="white" label="登入" size="lg" rounded /> -->
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
    function regClick(e,go){
        console.log(e);
        console.log(go);
    }
    return {
      regClick,
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
      UBN: ref(""),
      UBNtype: ref("公司統編"),
      regName: ref(""),
      businessName: ref(""),
      address: ref(""),
      name: ref(""),
      isPwd: ref(true),
      confirmPassword: ref(""),
      isConfirmPwd: ref(true),
      verify: ref(""),
      phoneFlag,
      right: ref(false),
      group: ref('taxType1'),
      tax_option: ref([
          {label: '有工商登記', value: 'taxType1', slot: '公司統編', ext_data:'合約簽訂公司名', ext_data2:'公司登記地址'},
          {label: '僅稅籍編號', value: 'taxType2', slot: '稅籍編號', ext_data:'營業人名稱', ext_data2:'稅籍登記地址'},
          {label: '皆無', value: 'taxType3', slot: '身分證字號', ext_data:'營業人名稱', ext_data2:'稅籍登記地址'}
        ]),
      payment_select: ref([ 'P1' ]),
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

    this,t
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
