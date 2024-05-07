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
    <h5 class="mainTitle">付款資訊 - 銀行轉帳</h5>
    <!-- <div class="inputGroup q-mb-lg">
      <q-btn-toggle v-model="PayType" color="grey" toggle-color="warning" :options="paymentMethod" size="15px" no-caps
        unelevated rounded />
    </div> -->
    <q-tab-panels class="q-mt-lg" v-model="PayType" animated transition-prev="fade" transition-next="fade">
      <!--銀行帳戶-->
      <q-tab-panel name="Bank" class="PayPanel">
        <!-- <div class="inputGroup">
          <p>請選擇合作銀行</p>
          <q-select v-model="Bank" :options="bankList" option-label="labal" option-value="value" outlined />
        </div> -->
        <q-tab-panels v-model="Bank.value" class="q-my-md">
          <q-tab-panel :name="bankItem.value" v-for="(bankItem, index) in bankList" :key="index">
            <q-list bordered separator id="info">
              <q-item v-ripple>
                <q-item-section @click="CopyPart">
                  <q-item-label overline>繳款銀行</q-item-label>
                  <q-item-label id="bankName">{{ bankItem.labal }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section @click="CopyPart">
                  <q-item-label overline>繳款銀行代碼</q-item-label>
                  <q-item-label id="bankCode">{{ bankItem.code }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section @click="CopyPart">
                  <q-item-label overline>繳款帳號</q-item-label>
                  <q-item-label id="bankAccount">{{ bankItem.account }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section @click="CopyPart">
                  <q-item-label overline>繳款金額</q-item-label>
                  <q-item-label id="amount">新台幣 {{ bankItem.amount }} 元</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section @click="CopyPart">
                  <q-item-label overline>繳款期限</q-item-label>
                  <q-item-label id="deadline">{{ bankItem.deadline }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <p class="q-mt-md text-negative text-subtitle1">※以上繳費方式僅限本次交易使用，逾期無效</p>
            <div class="BtnGroup q-gutter-sm">
              <q-btn class="text-subtitle1" color="warning" icon="content_copy" label="複製帳號" rounded @click="Copy" />
              <q-btn class="text-subtitle1" color="warning" icon="save_alt" label="保存繳費資訊" rounded @click="Print" />
              <q-btn class="text-subtitle1 float-right" color="secondary" icon="cancel" label="取消付款" rounded
                @click="Back" />
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
      <p class="text-subtitle1">交易注意事項</p>
      <ol class="text-body2">
        <li>請於繳款期限前，選擇任一銀行的行動銀行APP、ATM自動櫃員機或網路ATM完成轉帳</li>
        <li>逾期未轉帳，訂單將自動失效，需重新訂購</li>
        <li>轉帳完成後，若要申請取消交易，請聯絡本店客服中心處理</li>
        <li>其他相關疑問，請洽客服信箱: service@mail.com 或客服專線: (02) 1234-5678</li>
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
      PayType: ref('Bank'),
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
          deadline: '2024-04-25 23:41:04'
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
    function Back() {
      $q.notify({
        type: 'positive',
        message: "返回上一頁",
        position: "center",
      });
    }
    function CopyPart(a) {
      console.log(a);
      navigator.clipboard.writeText(a.target.innerText).then(() => $q.notify({
        type: 'positive',
        message: "已複製",
        position: "center",
      }))
    }
    function Print() {
      loadScript("http://html2canvas.hertzen.com/dist/html2canvas.min.js")
        .then(() => {
          html2canvas(document.getElementById('info')).then(function (canvas) {
            document.body.appendChild(canvas);
            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = 'info.jpg';
            a.click();
          });
        })
      $q.notify({
        type: 'positive',
        message: "保存繳費資訊畫面",
        position: "center",
      });
    }
    return {
      CheckPay,
      Clean,
      Copy,
      CopyPart,
      Print,
      Back,
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
