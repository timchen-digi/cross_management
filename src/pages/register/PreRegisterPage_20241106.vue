<template>
  <q-page padding>
    <div class="PreContent">
      <h5 class="MainTitle">商戶資料註冊</h5>
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
          <div class="text-subtitle1">英文營業名稱</div>
          <q-input color="warning" v-model="businessNameEn" rounded outlined placeholder="顯示於信用卡帳單的商店名稱"
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">實收資本額</div>
          <q-input color="warning" v-model="capital" rounded outlined placeholder=""
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">核准設立日期</div>
          <q-input color="warning" v-model="registerDate" rounded outlined placeholder="YYYY-MM-DD"
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">線上交易或商店網址</div>
          <q-input color="warning" v-model="storeLink" rounded outlined placeholder="非實體店家須提供線上付款網址" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">商戶類別代碼(MCC code)</div>
          <q-input color="warning" v-model="mcc" rounded outlined placeholder="4位數MCC，若不確定請留空" />
          <div class="text-subtitle1">販售商品說明</div>
          <q-input color="warning" v-model="productDesc" rounded outlined placeholder="簡述販賣商品內容" />
        </div>


        <h6>
          **此處可上傳附件檔案**
          1. 企業/個人存摺影本
          2. 公司登記核准文件(僅公司)
          3. 401表或其他登記文件(僅公司)
        </h6>

      </div>
      <h5 class="MainTitle">企業代表人資料</h5>
      <div class="inputContent">
        <div class="text-subtitle1">此欄位將進行身分證領補換資料驗證，請正確填寫。</div>
        <div class="text-subtitle1">&nbsp;</div>
        <div class="inputGroup">
          <div class="text-subtitle1">企業代表人姓名</div>
          <q-input color="warning" v-model="leaderName" rounded outlined placeholder=""
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">代表人身分證字號</div>
          <q-input color="warning" v-model="leaderId" rounded outlined placeholder=""
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">身分證發證日期</div>
          <q-input v-model="idYear" outlined rounded placeholder="民國 年 月 日" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">身分證發證地點</div>
          <div class="q-gutter-md row items-start">
            <q-select v-model="idLocate" :options="['北市', '高市', '新北市', '中市', '南市', '桃市',
              '北縣', '宜縣', '桃縣', '竹縣', '苗縣', '中縣', '彰縣', '投縣', '雲縣', '嘉縣', '南縣', '高縣', '屏縣',
              '東縣', '花縣', '澎縣', '基市', '竹市', '嘉市', '連江', '金門']" outlined />
            <q-select v-model="idType" :options="['初發', '換發']" outlined />
          </div>
        </div>
      </div>

      <h6>
        **此處可上傳附件檔案**
        負責人身分證影本正面 及 反面
      </h6>


      <h5 class="MainTitle">企業聯絡資料</h5>
      <div class="inputContent">
        <div class="inputGroup">
          <div class="text-subtitle1">聯絡人姓名</div>
          <q-input color="warning" v-model="contactName" rounded outlined placeholder=""
            :rules="[val => !!val || '此欄位必填']" />
        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">電子郵件</div>
          <q-input color="warning" v-model="email" type="email" rounded outlined placeholder=""
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
        <div class="inputGroup">
          <div class="text-subtitle1">註冊pin碼</div>
          <q-input color="warning" v-model="pinCode" rounded outlined placeholder="更新註冊資料使用，留空將由系統自動產生" />

        </div>
        <div class="inputGroup">
          <div class="text-subtitle1">介紹人</div>
          <q-input color="warning" v-model="inviter" rounded outlined placeholder="自動帶入" disabled />
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
    const contactName = ref("");
    const leaderName = ref("");
    const inviter = ref("");
    const registerDate = ref("");
    const capital = ref("");
    const leaderId = ref("");
    const leaderDate = ref("");
    const idLocate = ref("請選擇");
    const idType = ref("初發");
    const idYear = ref("");
    const idMonth = ref(1);
    const idDate = ref(1);
    const payment_select = ref(['P10']);
    const agreeRight = ref(false);
    const taxType = ref(0);
    const pinCode = ref("");
    const tax_option = [
      { label: '工商登記', value: 0, slot: '公司統編', ext_data: '合約簽訂公司名', ext_data2: '公司登記地址' },
      { label: '外國營利事業', value: 1, slot: 'Business Administration No.', ext_data: 'Name', ext_data2: 'Address' },
      { label: '個人戶', value: 2, slot: '身分證字號', ext_data: '營業人名稱', ext_data2: '營業地址' }
    ];
    function CheckInput() {
      var msg = "";
      var type = taxType.value;
      if (UBN.value == "") msg += tax_option[type].slot + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data2 + ", ";
      if (businessName.value == "") msg += "營業名稱, ";
      if (contactName.value == "") msg += "聯絡人, ";
      if (email.value == "") msg += "電子郵件, ";
      if (phoneNum.value == "") msg += "連絡電話, ";
      if (leaderName.value == "") msg += "企業代表人姓名, ";
      if (registerDate.value == "") msg += "核准設立日期, ";
      if (capital.value == "") msg += "實收資本額, ";
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
        ContactName: contactName.value,
        ContactMobile: phoneNum.value,
        ContactMail: email.value,
        SelectPayment: payment_select.value
      };
      console.log(sendObject);
      //return;
      // 打往後端
      // 預註冊
      alert("開發中");
      return;
      api.post('/Merchant/Preregister', sendObject, {
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
      contactName,
      leaderName,
      registerDate,
      capital,
      leaderId,
      leaderDate,
      idLocate, idType,
      idYear, idMonth, idDate,
      isPwd: ref(true),
      confirmPassword: ref(""),
      isConfirmPwd: ref(true),
      verify: ref(""),
      agreeRight,
      taxType,
      tax_option,
      payment_select,
      pinCode,
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
