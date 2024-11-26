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

  <q-card class="my-card q-ma-md q-pa-md" bordered v-show="false">
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
    <!-- <h5 class="mainTitle">請選擇付款方式</h5>
    <div class="inputGroup q-mb-lg">
      <q-btn-toggle v-model="PayType" color="grey" toggle-color="warning" :options="paymentMethod" size="15px" no-caps
        unelevated rounded />
    </div> -->

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
          <div class="col-lg-5 col-md-12 col-12 inputGroup" v-show="false">
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
          <q-btn class="text-subtitle1 float-right" color="secondary" icon="cancel" label="取消付款" rounded
            @click="$router.back()" />
        </div>
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
import { pointApi } from 'boot/axios'
import Swal from 'sweetalert2'
export default {
  name: 'CreditPayComponent',
  data() {
    return {
      monthArray: [],
      yearArray: [],
      emailRules: [
        (value) => !!value || 'Email欄位必填',
        (value) => /.+@.+\..+/.test(value) || '請輸入正確的Email地址'
      ],
      MailCode: ref('customermail@mail.com'),
      PayType: ref('Credit'),
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
      CV: ref(''),
    }
  },
  mounted() {
    this.getMonthArray();
    this.getYearArray();
    this.checkIssuer();
  },
  setup() {
    let uri = window.location.hash.split('?')[1]
    //console.log(uri)
    let params = new URLSearchParams(uri)
    //const Account = params.get("A")
    const TID = params.get("E")
    const Amount = params.get("P")
    const MID = params.get("M")
    if (Amount == null || TID == null || MID == null) {
      alert("付款資訊有誤")
      this.$router.push("/Pay/")
      return
    }
    const OrderList = [
      {
        title: "商品名稱",
        Contact: GetCookieValue("User.Prodoct")
      }, {
        title: "商品說明",
        Contact: GetCookieValue("User.Prodoct")
      }, {
        title: "支付金額",
        Contact: "NT$ " + Amount
      }
    ]
    const phoneNumber = ref("972831132");
    const phonePrefix = ref("+886");
    const emailAddress = ref(GetCookieValue("User.Email"));
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
      //loadScript("https://robot.wepay.tw/s/content/jsencrypt.min.js")
      loadScript("/m/jsencrypt.min.js")
        .then(() => {
          var tCardInfo = cardNumber.value + ',' + expM.value + expY.value + ',' + CVC.value
          //tCardInfo = tCardInfo + ',' + emailAddress.value;
          // 加密card Info
          console.log(tCardInfo)
          var encrypt = new JSEncrypt();
          const publicKey = "-----BEGIN PUBLIC KEY-----\
                              MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqluZxy3BkrP92hX38FMxCWuFpzC6UOso\
                              LuT2nIw6jd9XKEGg/Md7qDotsq7adS2Xh6WWjWxNKdkSiutQOfpsxVJ3OabHonz1IKg/qBLFu93Q\
                              RG5kM9QD25oK1pduZiHkSTMBvFhxgCp37SbFE2Eq6ADUFTo2FQ2SqYTZ6S6SsB45KdSmYBwlrXi8\
                              G7rOspEU3mAd2GjWBfggMRF+2DfZsbBv4x1+OByHOFFOFyT9/mX8dKDna9xebjQ65LDCy/i6Ok14\
                              lmQzQGGhcq1uz4MzSRftObxzqctgaShrtPEfDMf4rnaTlClXI62pnihj/Xr71OpObmAgihH56xEh\
                              iTM0BQIDAQAB\
                              -----END PUBLIC KEY-----";
          encrypt.setPublicKey(publicKey);
          var encrypted = encrypt.encrypt(tCardInfo);
          console.log(encrypted);
          let uri = window.location.hash.split('?')[1]
          // test
          let query = {
            "param": {
              "Version": "1.0",
              "MID": MID,
              "TID": TID,
              "PaymentID": "4",
              "Amount": Amount,
              // "InvoiceType": 1,
              "InvoiceType": 0,
              // "CarrierType": 1,
              "Email": emailAddress.value,
              "PaymentType": "1",
              "Amount": Amount * 100,
              "EncryptCardInfo": encrypted
            }
          }
          console.log("送出內容")
          console.log(query)
          pointApi.post('/Credit', query, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "isCode": 0,
              "apiKey": "87654321876543218765432187654321",
              "type": 0
            }
          })
            .then((response) => {
              console.log(response.data)
              if (response.data.param.ReturnCode == "000000") {
                console.log("建立成功")
                console.log(response.data.param)
                var content = response.data.param.content
                if (content.Type == "2") {
                  var htmlCode = content.HTML
                  const newWindow = window.open("about:blank");
                  newWindow.document.write(htmlCode);
                  Swal.fire("交易進行中，請執行3D驗證完成付款流程\n交易編號" + content.TransNO);
                }
                else if (content.Type == "1") {
                  var auth = {
                    TransNO: content.TransNO,
                    AuthCode: content.AuthCode,
                    AuthDate: content.AuthDate,
                    AuthTime: content.AuthTime
                  }
                }
              }
              else {
                alert("交易建立失敗，錯誤代碼" + response.data.param.ReturnCode)
                $q.notify({
                  type: 'negative',
                  message: "交易建立失敗 " + response.data.param.ReturnMsg,
                  position: "center",
                });
              }
            })
            .catch(function (error) {
              $q.notify({
                type: 'negative',
                message: "交易建立失敗 " + error,
                position: "center",
              });
            })
        })
      var message = cardNumber.value + "|" + issuer.value + "|" + expM.value + "/" + expY.value + "|" + emailAddress.value;

      return;
    }
    function GetCookieValue(name) {
      const regex = new RegExp(`(^| )${name}=([^;]+)`)
      const match = document.cookie.match(regex)
      if (match) {
        return match[2]
      }
    }
    function Clean() {
      phoneNumber.value = "";
      phonePrefix.value = "+886";
      emailAddress.value = "";
      expM.value = "MM";
      expY.value = "YY";
      CVC.value = "";
      cardNumber.value = "";
      issuer.value = "";
      issuerIcon.value = "";
      issuerState.value = false;
    }
    return {
      CheckPay,
      Clean,
      OrderList,
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
