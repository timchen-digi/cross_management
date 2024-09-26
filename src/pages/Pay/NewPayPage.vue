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
    <h5 class="mainTitle">發票資訊填寫</h5>
    <div class="ProdBOX">
    </div>
    <div class="inputGroup q-mb-lg">
      <q-btn-toggle v-model="InvoiceType" color="grey" toggle-color="warning" :options="InvoiceMethod" size="15px"
        no-caps unelevated rounded />
    </div>
    <q-tab-panels class="q-mt-lg" v-model="InvoiceType" animated transition-prev="fade" transition-next="fade">
      <q-tab-panel name="inv_personal" class="PayPanel">
        <div id="inv_personal_Content" class="InputBOX invTypeBox inv_personal">
          <div class="input-group" style="max-width: 50% ;padding:10px">
            <q-input v-model="MailCode" outlined readonly label="電子郵件載具" />
          </div>
          <div class="Remarks">
            <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/" target="_blank">財政部電子發票整合服務平台</a>
            </p>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="inv_Triple_Online" class="PayPanel">
        <div class="InputBOX invTypeBox inv_Paper" style="max-width: 50%;">
          <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入統一編號' />
          <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入公司名稱' />
        </div>
        <div class="Remarks">
          <p class="text_Red">*開立發票後，下載並列印電子發票證明聯(報帳用)，節省發票郵寄時間。</p>
          <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/" target="_blank">財政部電子發票整合服務平台</a>
          </p>
        </div>
      </q-tab-panel>
      <q-tab-panel name="inv_Donate" class="PayPanel">
        <div class="q-pa-md InputBOX invTypeBox inv_Donate">
          <q-option-group :options="InvoiceDonateOptions" type="radio" v-model="InvoiceDonate" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="inv_Paper" class="PayPanel">
        <div class="InputBOX invTypeBox inv_Paper" style="max-width: 50%">
          <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入姓名' />
          <q-input v-model="VehicleCode_Citizen" outlined placeholder='發票寄送地址' />
        </div>
        <div class="Remarks">
          <p>發票於到貨後猶豫期+5個工作天以平信寄出。</p>
          <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/" target="_blank">財政部電子發票整合服務平台</a>
          </p>
        </div>
      </q-tab-panel>
      <q-tab-panel name="inv_Triple" class="PayPanel">
        <div class="InputBOX invTypeBox inv_Paper" style="max-width: 50%">
          <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入統一編號' />
          <q-input v-model="VehicleCode_Citizen2" outlined placeholder='請輸入公司名稱' />
          <q-input v-model="VehicleCode_Citizen3" outlined placeholder='發票寄送地址' />
        </div>
        <div class="Remarks">
          <p>發票於到貨後猶豫期+5個工作天以平信寄出。</p>
          <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/" target="_blank">財政部電子發票整合服務平台</a>
          </p>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <q-card class="my-card q-ma-md q-pa-md" bordered>
    <h5 class="mainTitle">請選擇付款方式</h5>
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
          <q-select v-model="Bank" :options="bankList" option-label="label" option-value="value" outlined />
        </div> -->
        <q-tab-panels v-model="Bank.value" class="q-my-md">
          <q-tab-panel :name="bankItem.value" v-for="(bankItem, index) in bankList" :key="index">
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款銀行</q-item-label>
                  <q-item-label id="bankName">{{ bankItem.label }}</q-item-label>
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

      <!--錢包-->
      <q-tab-panel name="Wallet" class="PayPanel">
        <div class="text-h6">點選跳轉至錢包APP完成付款</div>
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card style="max-width: 45%;">
            <a href="https://www.jkopay.com" target="_blank" style=" ">
              <img src="~/assets/logos/payment/4.png" style=" width: 85%; height: 85%; left:50%;">
            </a>
          </q-card>
          <q-card style="max-width: 45%;">
            <a href="https://www.pxpayplus.com" target="_blank">
              <img src="~/assets/logos/payment/46.png" style="width: 85%; height: 85%; left:50%;">
            </a>
          </q-card>
        </div>
      </q-tab-panel>
      <q-tab-panel name="Point" class="PayPanel">
        <div class="text-h6">點選跳轉至點數頁面完成付款</div>
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card style="max-width: 45%;">
            <a href="https://www.mycard520.com.tw" target="_blank" style=" ">
              <img src="~/assets/logos/payment/mycard3.png" style=" width: 85%; height: 85%;">
            </a>
          </q-card>
          <q-card style="max-width: 45%;">
            <a href="https://ec.gashpoint.com/" target="_blank">
              <img src="~/assets/logos/payment/gash.png" style="width: 85%; height: 85%;">
            </a>
          </q-card>
        </div>
      </q-tab-panel>


      <q-tab-panel name="CVStore" class="PayPanel">
        <div class="text-h6">選擇超商，生成繳費代碼</div>
        <!-- <div class="q-pa-md InputBOX invTypeBox inv_Donate">
          <q-option-group :options="CVList" type="radio" v-model="CV" />
        </div> -->
        <q-radio v-model="CV" val="fami" label="全家便利商店" />
        <q-radio v-model="CV" val="7-11" label="7-ELEVEN" />
        <q-radio v-model="CV" val="hilife" label="萊爾富" />
        <q-tab-panels class="q-mt-lg" v-model="CV" animated transition-prev="fade" transition-next="fade">
          <q-tab-panel :name="CVItem.value" v-for="(CVItem, index) in CVList" :key="index">
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款通路</q-item-label>
                  <q-item-label id="CVName">{{ CVItem.label }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳費代碼</q-item-label>
                  <q-item-label id="CVPinCode">{{ CVItem.pin_code }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款金額</q-item-label>
                  <q-item-label id="amount">新台幣 {{ CVItem.amount }} 元</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-ripple>
                <q-item-section>
                  <q-item-label overline>繳款期限</q-item-label>
                  <q-item-label id="deadline">{{ CVItem.deadline }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <p class="q-mt-md text-negative text-subtitle1">※以上繳費方式僅限本次交易使用，逾期無效</p>
            <p class="q-mt-md">您可記下上方所顯示碼繳費代碼，到超商選擇「繳費」下的「代碼繳費」功能，依照指示輸入繳費代碼以列印出繳費單</p>
            <p class="q-mt-md">持繳費單至櫃檯繳費，便可完成付款</p>
            <div class="BtnGroup q-gutter-sm">
              <q-btn class="text-subtitle1" color="warning" icon="content_copy" label="複製繳費代碼" rounded
                @click="CopyCv" />
              <q-btn class="text-subtitle1" color="warning" icon="print" label="生成三段式條碼" rounded @click="Print" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
    </q-tab-panels>

  </q-card>

  <q-card class="my-card q-ma-md q-pa-md" bordered>
    <h5 class="mainTitle">注意事項</h5>
    <div class="q-pa-sm">
      <p class="text-subtitle1">商家自訂說明</p>
      <ol class="text-body2">
        <li>一經完成付款，無法退款，請洽原購買商家[可自訂說明]。</li>
        <li>若您有任何付款操作問題，請利用以下方式，我們將有專人為您服務。</li>
        EMAIL: <a href="mailto: cs@digiflowtech.com"> cs@digiflowtech.com </a>

      </ol>
      <!-- <q-separator class="q-my-md" />
      <p class="text-subtitle1">扣款說明</p>
      <ol class="text-body2">
        <li>扣款說明XXXXX</li>
        <li>扣款說明XXXXXXXXX</li>
      </ol> -->
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
      MailCode: ref('customermail@mail.com'),
      OrderList: [
        {
          title: "商品名稱",
          Contact: "MyProduct123"
        }, {
          title: "訂單編號",
          Contact: "240401120954"
        }, {
          title: "商品說明",
          Contact: "數位內容月卡"
        }, {
          title: "支付金額",
          Contact: "NT$ 300"
        }
      ],
      PayType: ref('Bank'),
      paymentMethod: [
        // {
        //   label: '信用卡',
        //   value: 'Credit'
        // },
        {
          label: '銀行帳戶',
          value: 'Bank'
        },
        {
          label: '錢包',
          value: 'Wallet'
        },
        {
          label: '點數',
          value: 'Point'
        },
        {
          label: '超商代碼',
          value: 'CVStore'
        }
      ],
      InvoiceDonate: ref('51811'),
      InvoiceDonateOptions: [
        { label: '第一社會福利基金會', value: '51811' },
        { label: '董氏基金會', value: '531' },
        { label: '中華民國脊髓損傷者聯合會', value: '2628' },
        { label: '關懷台灣文教基金會', value: '9271' }
      ],
      InvoiceType: ref('inv_personal'),
      InvoiceMethod: [{ label: '個人雲端發票', value: 'inv_personal' },
      { label: '公司發票', value: 'inv_Triple_Online' },
      { label: '發票捐贈', value: 'inv_Donate' },
        // { label: '個人紙本發票', value: 'inv_Paper' },
        // { label: '公司用(郵寄)', value: 'inv_Triple' }
      ],
      Bank: ref({
        label: '玉山銀行',
        value: 'esun'
      }),
      CV: ref(''),
      bankList: [
        {
          label: '玉山銀行',
          value: 'esun',
          code: '808',
          account: '6153840960096125',
          amount: '300',
          deadline: '2024-12-31 23:59:59'
        }, {
          label: '彰化銀行',
          value: 'chb',
          code: '009',
          account: '96013456789101',
          amount: '300',
          deadline: '2024-04-02 13:41:04'
        }, {
          label: '台北富邦銀行',
          value: 'tpfubon',
          code: '012',
          account: '1234567890123456',
          amount: '300',
          deadline: '2024-04-02 13:41:04'
        }
      ],
      CVList: [
        {
          label: '全家便利商店',
          value: 'fami',
          pin_code: '1870F2954C5309',
          ol_code_1: '1870F2954C5309',
          ol_code_2: '1870F2954C5309',
          ol_code_3: '1870F2954C5309',
          amount: '300',
          deadline: '2024-12-31 23:59:59'
        },
        {
          label: '7-ELEVEN',
          value: '7-11',
          pin_code: '012346567890',
          ol_code_1: '1870F2954C5309',
          ol_code_2: '1870F2954C5309',
          ol_code_3: '1870F2954C5309',
          amount: '300',
          deadline: '2024-12-31 23:59:59'
        }, {
          label: '萊爾富',
          value: 'hilife',
          pin_code: '9807565403021',
          ol_code_1: '1870F2954C5309',
          ol_code_2: '1870F2954C5309',
          ol_code_3: '1870F2954C5309',
          amount: '300',
          deadline: '2024-12-31 23:59:59'
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
    const phoneNumber = ref("972831132");
    const phonePrefix = ref("+886");
    const emailAddress = ref("timchen@digiflowtech.com");
    const expM = ref('06');
    const expY = ref('25');
    const CVC = ref('964');
    const agreeSubscribe = ref(false);
    const cardNumber = ref('4029874599701007');
    const VehicleCode_Citizen = ref('')
    const VehicleCode_Citizen2 = ref('')
    const VehicleCode_Citizen3 = ref('')
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
          var tCardInfo = cardNumber.value + ',' + expM.value + ',' + expY.value + ',' + CVC.value + ',' + emailAddress.value;
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
          alert(encrypted);
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
    function CopyCv() {
      var text = document.getElementById("CVPinCode").innerText;
      navigator.clipboard.writeText(text).then(() => $q.notify({
        type: 'positive',
        message: "已複製",
        position: "center",
      }))
    }
    return {
      CheckPay,
      Clean,
      Copy,
      CopyCv,
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

.Remarks
  font-size: 15px
  color: #626262
  padding: 0 10px
  margin: 20px auto

.Remarks p
  margin: 10px auto

.text_Red
  color: #be0000

q-input
  margin: 10px
  padding: 10px
</style>
