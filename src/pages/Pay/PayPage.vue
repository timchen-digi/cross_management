<template>
  <q-card class="my-card q-ma-md q-pa-md" bordered>
    <h5 class="mainTitle">訂單資訊</h5>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders orderCard">
        <q-expansion-item default-opened class="orderTitle" icon="list_alt" label="訂單明細" v-model="expanded">
          <q-separator />
          <q-card>
            <q-card-section>
              <q-list separator class="orderList">
                <q-item v-for="(item, index) in OrderList" :key="index" clickabled>
                  <q-item-section class="col-sm-2 col-4">{{ item.title }}</q-item-section>
                  <q-item-section>{{ item.Contact }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

    </div>
  </q-card>
  <q-card class="my-card q-ma-md q-pa-md" bordered>
    <h5 class="mainTitle">付款方式</h5>
    <div class="inputGroup q-mb-lg">
      <q-btn-toggle v-model="PayType" color="grey" toggle-color="warning" :options="paymentMethod" size="15px" no-caps
        unelevated rounded />
    </div>

    <q-tab-panels class="q-mt-lg" v-model="PayType" animated transition-prev="fade" transition-next="fade">

      <!--信用卡-->
      <q-tab-panel name="Credit" class="PayPanel">
        <div class="inputGroup">
          <p>信用卡卡號</p>
          <q-input v-model="cardNumber" mask="#### #### #### ####" fill-mask="○" name="cardNumber"
            @update:model-value="checkIssuer()" autocomplete="credit" outlined bottom-slots standout>
            <template v-slot:append>
              <q-icon :name="issuerIcon" color="warning" size="lg" />
              <q-img v-if="issuer === '銀聯卡'" src="~/assets/icons/unionpay-pay.svg" alt="銀聯卡" style="min-width: 50px;" />
            </template>
            <template v-if="issuerState" v-slot:hint>
              發卡機構：{{ issuer }}
            </template>
          </q-input>
        </div>

        <div class="row">
          <div class="col-lg-5 col-md-12 col-12 inputGroup">
            <p>信用卡有效期限(月/年)</p>
            <div class="q-gutter-md row">
              <q-select v-model="expM" :options="monthArray" name="cardMonth" autocomplete="credit" outlined />
              <q-select v-model="expY" :options="yearArray" name="cardYear" autocomplete="credit" outlined />
            </div>
          </div>
          <div class="col-lg-7 col-md-12 col-12 inputGroup">
            <p>信用卡安全碼(CVC)</p>
            <q-input v-model="CVC" :rules="[val => val.length >= 3 || '請輸入信用卡背面末三碼']" maxlength="3" name="CVC"
              hint="信用卡背面末三碼" autocomplete="credit" outlined bottom-slots />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-md-12 col-12 inputGroup">
            <p>手機號碼</p>
            <div class="q-gutter-md row items-start">
              <q-select v-model="phonePrefix" :options="['+886', '+86', '+852', '+1']" outlined />
              <q-input v-model="phoneNumber" label="請輸入手機號碼" type="tel" outlined />
            </div>
          </div>
          <div class="col-lg-7 col-md-12 col-12 inputGroup">
            <p>Email</p>
            <q-input v-model="emailAddress" :rules="emailRules" type="email" label="請輸入電子郵件" name="email"
              autocomplete="email" lazy-rules outlined />
          </div>
        </div>


        <q-checkbox v-model="agreeSubscribe" label="同意每月自動扣款" color="orange" required />

        <div class="BtnGroup q-gutter-sm">
          <q-btn class="text-subtitle1" color="warning" icon="paid" label="確認付款" rounded @click="CheckPay" />
          <q-btn class="text-subtitle1" icon="restart_alt" label="清除重填" rounded @click="Clean" />
        </div>

      </q-tab-panel>


      <!--銀行帳戶-->
      <q-tab-panel name="Bank" class="PayPanel">
        <!-- <div class="inputGroup">
          <p>請選擇合作銀行</p>
          <q-select v-model="Bank" :options="bankList" option-label="labal" option-value="value" outlined />
        </div> -->
        <q-tab-panels v-model="Bank.value" class="q-my-md">
          <q-tab-panel :name="bankItem.value" v-for="(bankItem, index) in bankList" :key="index">
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款銀行</q-item-label>
                  <q-item-label id="bankName">{{ bankItem.labal }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款銀行代碼</q-item-label>
                  <q-item-label id="bankCode">{{ bankItem.code }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款帳號</q-item-label>
                  <q-item-label id="bankAccount">{{ bankItem.account }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款金額</q-item-label>
                  <q-item-label id="amount">新台幣 {{ bankItem.amount }} 元</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款期限</q-item-label>
                  <q-item-label id="deadline">{{ bankItem.deadline }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <p class="q-mt-md text-negative text-subtitle1">※以上繳費方式僅限本次交易使用，逾期無效</p>
            <div class="BtnGroup q-gutter-sm">
              <q-btn class="text-subtitle1" color="warning" icon="content_copy" label="複製帳號" rounded @click="Copy" />
              <q-btn class="text-subtitle1" color="warning" icon="print" label="列印繳費資訊" rounded @click="Print" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>


      <q-tab-panel name="Other">
        <div class="text-h6">Other</div>
      </q-tab-panel>
    </q-tab-panels>

  </q-card>

  <q-card class="my-card q-ma-md q-pa-md" bordered>
    <h5 class="mainTitle">注意事項</h5>
    <div class="q-pa-sm">
      <p class="text-subtitle1">商家自訂說明</p>
      <ol class="text-body2">
        <li>商家說明12345</li>
        <li>商家說明ABCDE</li>
        <li>若您要取消自動扣款，請聯絡本店客服</li>
        <li>其他疑問請洽客服: service@mail.com</li>
      </ol>
      <q-separator class="q-my-md" />
      <p class="text-subtitle1">扣款說明</p>
      <ol class="text-body2">
        <li>您同意系統於每月自動扣款OO元</li>
        <li>扣款說明XXXXX</li>
      </ol>
    </div>
  </q-card>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import { loadScript } from "vue-plugin-load-script";
export default {
  name: 'PayComponent',
  data() {
    return {
      monthArray: [],
      yearArray: [],
      emailRules: [
        (value) => !!value || 'Email欄位必填',
        (value) => /.+@.+\..+/.test(value) || '請輸入正確的Email地址'
      ],
      OrderList: [
        {
          title: "商品名稱",
          Contact: "MyProduct123"
        }, {
          title: "訂單編號",
          Contact: "240401120954"
        }, {
          title: "商品說明",
          Contact: "商品說明文字商品說明文字商品說明文字"
        }, {
          title: "支付金額",
          Contact: "NT$ 300"
        }
      ],
      PayType: ref('Credit'),
      paymentMethod: [
        {
          label: '信用卡',
          value: 'Credit'
        }, {
          label: '銀行帳戶',
          value: 'Bank'
        }, {
          label: '其他付款方式',
          value: 'Other'
        }
      ],
      Bank: ref({
        labal: '玉山銀行',
        value: 'esun'
      }),
      bankList: [
        {
          labal: '玉山銀行',
          value: 'esun',
          code: '808',
          account: '6153840960096125',
          amount: '300',
          deadline: '2024-04-02 13:41:04'
        }, {
          labal: '彰化銀行',
          value: 'chb',
          code: '009',
          account: '96013456789101',
          amount: '300',
          deadline: '2024-04-02 13:41:04'
        }, {
          labal: '台北富邦銀行',
          value: 'tpfubon',
          code: '012',
          account: '1234567890123456',
          amount: '300',
          deadline: '2024-04-02 13:41:04'
        }
      ]
    }
  },
  mounted() {
    this.getMonthArray();
    this.getYearArray();
    this.checkIssuer();
  },
  setup() {
    const phoneNumber = ref("");
    const phonePrefix = ref("+886");
    const emailAddress = ref("");
    const expM = ref('MM');
    const expY = ref('YY');
    const CVC = ref(null);
    const agreeSubscribe = ref(false);
    const cardNumber = ref('');
    const issuer = ref('');
    const issuerIcon = ref('');
    const issuerState = ref(false);
    const $q = useQuasar()
    function CheckPay() {
      // 檢查輸入
      if (CVC.value.length == 3 && cardNumber.value.length == 16) {

      }
      // 引入既有的加密
      loadScript("https://robot.wepay.tw/s/content/jsencrypt.min.js")
        .then(() => {
          var tCardInfo = cardNumber.value + ',' + expM.value + ',' + expY.value + ',' + CVC.value;
          // 加密card Info
          var encrypt = new JSEncrypt();
          const publicKey = "-----BEGIN PUBLIC KEY-----\
                          MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvjhCPqzmRkTb10b1uETg/+jQYc++HX3z\
                          VWE2MBLa1pIoY7SDVKgbZaYOVR0vm/kxJSWSFhO+Px6fN+jj1yBx8MbAqY4//hs8maQ9zo9um2d8\
                          DpwBYSMxte0bvtVUm+fRjDbsPAcYpDMemaqMeR8g8Gk0iMGquE2HbfkzTel+AoO1jfhvZiIq439Y\
                          ShFxysCY1pmDoU90wic/XuldlLNnuSUt6XIRidI8GxzB0AynsSi+UEOk3U5asMoWB+7cbfshZRR0\
                          0Bh/P60u4thjZ+QpxfLOgNIwLvpKIHPiNnIPhtwEOrMVqDhIvDeMGVFCDF0GPjR4GUxSh08wCWCY\
                          y35SvQIDAQAB\
                          -----END PUBLIC KEY-----";
          encrypt.setPublicKey(publicKey);
          var encrypted = encrypt.encrypt(tCardInfo);
          console.log(encrypted);
          $q.notify({
            type: 'positive',
            message: "呼叫數位鎏付款API",
            position: "center",
          });
        })
      var message = cardNumber.value + "|" + issuer.value + "|" + expM.value + "/" + expY.value + "|" + emailAddress.value;

      return;
    }
    function Clean() {
      phoneNumber.value = "";
      phonePrefix.value = "+886";
      emailAddress.value = "";
      expM.value = "MM";
      expY.value = "YY";
      CVC.value = null;
      cardNumber.value = "";
      issuer.value = "";
      issuerIcon.value = "";
      issuerState.value = false;
    }
    function Copy() {
      var bankName = document.getElementById("bankName").innerText;
      var bankCode = document.getElementById("bankCode").innerText;
      var bankAccount = document.getElementById("bankAccount").innerText;
      var amount = document.getElementById("amount").innerText;
      var deadline = document.getElementById("deadline").innerText;
      var text = "繳款銀行: " + bankName + "\n繳款銀行代碼: " + bankCode + "\n繳款帳號: " + bankAccount + "\n繳款金額: " + amount + "\n繳款期限: " + deadline;
      navigator.clipboard.writeText(text).then(() => $q.notify({
        type: 'positive',
        message: "已複製",
        position: "center",
      }))
    }
    function Print() {
      $q.notify({
        type: 'positive',
        message: "列印繳費單",
        position: "center",
      });
    }
    return {
      CheckPay,
      Clean,
      Copy,
      Print,
      phoneNumber,
      phonePrefix,
      emailAddress,
      expM,
      expY,
      CVC,
      agreeSubscribe,
      expanded: ref(true),
      getMonthArray() {
        const months = [];
        for (let i = 1; i <= 12; i++) {
          const twoDigitsMonth = ('0' + i).slice(-2);
          months.push(twoDigitsMonth);
        }
        this.monthArray = months;
      },
      getYearArray() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 13; i++) {
          const year = currentYear + i;
          /*const lastTwoDigits = year.toString().slice(-2);*/
          years.push(year);
        }
        this.yearArray = years;
      },
      checkIssuer() {
        const cardNumber = this.cardNumber;
        const bin = cardNumber.replace(/○|\s/g, "").slice(0, 6);
        if (bin.charAt(0) === '4') {
          this.issuer = 'Visa';
          this.issuerIcon = 'fa-brands fa-cc-visa'
          this.issuerState = true
        } else if (bin.slice(0, 2) >= '51' && bin.slice(0, 2) <= '55') {
          this.issuer = 'Master Card';
          this.issuerIcon = 'fa-brands fa-cc-mastercard'
          this.issuerState = true
        } else if (bin.slice(0, 2) == '37' || bin.slice(0, 2) == '34') {
          this.issuer = 'American Express';
          this.issuerIcon = 'fa-brands fa-cc-amex'
          this.issuerState = true
        } else if (bin.slice(0, 2) === '62') {
          this.issuer = '銀聯卡';
          this.issuerIcon = 'las la-unionpay'
          this.issuerState = true
        } else if (bin.slice(0, 4) >= '3528' && bin.slice(0, 4) <= '3589') {
          this.issuer = 'JCB';
          this.issuerIcon = 'fa-brands fa-cc-jcb'
          this.issuerState = true
        } else {
          this.issuer = "未知";
          this.issuerIcon = ''
          this.issuerState = false
        }
      },
      cardNumber,
      issuer,
      issuerIcon,
      issuerState
    }
  },
}
</script>

<style lang="sass" scoped>
.paytype-toggle
  border: 1px solid gray
.my-card

  .mainTitle
    color: #bfa24a
    font-weight: bold
    margin: 10px 0 20px 0
    border-bottom: 1px solid #bfa24a
    padding-bottom: 5px

  .orderCard
    border-color: #ffb300

    .orderList
      border-color: #dfdfdf

.PayPanel
  padding: 0

.inputGroup
  padding-bottom: 15px
  margin-bottom: 10px

  p
    margin: 0 0 10px 0

  label
    padding-bottom: 10px

.q-field__messages
    text-align: right

.BtnGroup
  margin: 1rem 0
</style>
