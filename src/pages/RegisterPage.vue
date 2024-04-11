<template>
  <q-page padding>
    <div class="LoginContent">
      <h5 class="MainTitle">商戶申請</h5>
      <div class="text-subtitle1">營業登記類別</div>
      <div class="inputGroup q-mb-lg">
        <q-btn-toggle v-model="taxType" color="grey" toggle-color="warning" :options="tax_option" size="15px" no-caps
          unelevated rounded />
      </div>
      <div class="inputContent">
        <div class="inputGroup" v-if="taxType == 0 || taxType == 1">
          <div class="text-subtitle1">{{ tax_option[taxType].slot }}</div>
          <q-input color="warning" v-model="UBN" rounded outlined :rules="[checkTaxInfo]">
          </q-input>
        </div>
        <div class="inputGroup" v-else>
          <div class="text-subtitle1">{{ tax_option[taxType].slot }}</div>
          <q-input color="warning" v-model="UBN" rounded outlined :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup" v-if="taxType == 0 || taxType == 1">
          <div class="text-subtitle1">{{ tax_option[taxType].ext_data }}</div>
          <q-input color="warning" v-model="regName" rounded outlined disable bg-color="grey-3" />
        </div>
        <div class="inputGroup" v-else>
          <div class="text-subtitle1">{{ tax_option[taxType].ext_data }}</div>
          <q-input color="warning" v-model="regName" rounded outlined :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup" v-if="taxType == 0 || taxType == 1">
          <div class="text-subtitle1">{{ tax_option[taxType].ext_data2 }}</div>
          <q-input v-model="address" rounded outlined disable bg-color="grey-3" />
        </div>
        <div class="inputGroup" v-else>
          <div class="text-subtitle1">{{ tax_option[taxType].ext_data2 }}</div>
          <q-input v-model="address" rounded outlined :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">營業名稱</div>
          <q-input color="warning" v-model="businessName" rounded outlined placeholder="顯示予付款用戶的商店名稱"
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">聯絡人</div>
          <q-input color="warning" v-model="name" rounded outlined placeholder="註冊後，將有專人與您聯絡"
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">電子郵件</div>
          <q-input color="warning" v-model="email" type="email" rounded outlined placeholder="登入驗證碼將發送至此信箱"
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">連絡電話</div>
          <div class="q-gutter-md row items-start">
            <q-select v-model="phonePrefix" :options="['+886', '+86', '+852', '+1']" outlined rounded />
            <q-input v-model="phoneNum" label="請輸入手機號碼" type="tel" outlined rounded
              :rules="[val => !!val || '此欄位必填']" />
          </div>
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
              <q-checkbox color="warning" v-model="agreeRight" />
            </q-item-section>
            <q-item-section>
              <q-item-label>我已閱讀並且同意 數位鎏金融服務的 <a href="#">服務條款</a></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="BtnGroup">
        <q-btn color="warning" text-color="black" label="註冊" size="lg" rounded @click="regClick" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { ref } from "vue";
import Sidentify from "/src/utils/identify.vue"
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
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
    const companyInfo = ref(null);
    const UBN = ref("");
    const regName = ref("");
    const address = ref("");
    const email = ref("");
    const phoneNum = ref("");
    const businessName = ref("");
    const name = ref("");
    const payment_select = ref(['P10']);
    const agreeRight = ref(false);
    const taxType = ref(0);
    const tax_option = [
      { label: '工商登記', value: 0, slot: '公司統編', ext_data: '合約簽訂公司名', ext_data2: '公司登記地址' },
      { label: '稅籍編號', value: 1, slot: '稅籍編號', ext_data: '營業人名稱', ext_data2: '稅籍登記地址' },
      { label: '無登記', value: 2, slot: '身分證字號', ext_data: '營業人名稱', ext_data2: '營業地址' }
    ];
    function CheckInput() {
      var msg = "";
      var type = taxType.value;
      if (UBN.value == "") msg += tax_option[type].slot + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data2 + ", ";
      if (businessName.value == "") msg += "營業名稱, ";
      if (name.value == "") msg += "聯絡人, ";
      if (email.value == "") msg += "電子郵件, ";
      if (phoneNum.value == "") msg += "連絡電話, ";
      if (msg != "") msg = "請填寫" + msg.substring(0, msg.length - 2) + "欄位";
      return msg;
    }
    function regClick(e, go) {
      // 各欄位皆必填
      var alertMessage = CheckInput();
      if (alertMessage != "") {
        $q.notify({
          type: 'warning',
          message: alertMessage,
          position: "center",
        });
        return;
      }
      if (!agreeRight.value) {
        $q.notify({
          type: 'warning',
          message: "請閱讀並同意服務條款",
          position: "center",
        });
        return;
      }
      const sendObject = {
        UBN: UBN.value,
        Type: 1,
        RegistName: regName.value,
        BusinessName: businessName.value,
        RegistAddress: address.value,
        BusinessAddress: address.value,
        ContactName: name.value,
        ContactMobile: phoneNum.value,
        ContactMail: email.value,
        SelectPayment: payment_select.value
      };
      console.log(sendObject);
      //return;
      //打往後端
      api.post('/Merchant/Create', sendObject, {
        headers: {}
      })
        .then((response) => {
          console.log(response.data);
          $q.notify({
            message: "已送出註冊，請至信箱確認",
            type: 'positive',
            position: "center"
          });
        })
        .catch(function (error) {
          // handle error
          $q.notify({
            type: 'negative',
            message: "連線失敗 " + error,
            position: "center",
          });
        })
    }
    const $q = useQuasar()
    function checkTaxInfo(val) {
      if (val.length != 8) {
        // 統編必須是8碼
        return ('統編長度為8碼');
      }
      // 財政部API查詢公司登記
      api.get('https://eip.fia.gov.tw/OAI/api/businessRegistration/' + val)
        .then((response) => {
          companyInfo.value = response.data;
          console.log(response.data);
          regName.value = companyInfo.value.businessNm;
          address.value = companyInfo.value.businessAddress;
          return true;
        })
        .catch(function (error) {
          console.log(error.config);
          $q.notify({
            message: "查無此統編",
            position: "center",
            type: 'negative',
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        });
    }
    return {
      regClick,
      checkTaxInfo,
      email,
      phonePrefix: ref("+886"),
      phoneNum,
      password: ref(""),
      UBN,
      regName,
      businessName,
      address,
      name,
      isPwd: ref(true),
      confirmPassword: ref(""),
      isConfirmPwd: ref(true),
      verify: ref(""),
      agreeRight,
      taxType,
      tax_option,
      payment_select,
      isSuccess: true,
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
