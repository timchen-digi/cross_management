<template>
  <div class="BannerBlock">
    <div class="row mainBanner">
      <div class="BannerTitle col-lg-6 col-12">
        <div>
          <h1 class="mainTitle">線上付款</h1>
          <p class="subTitle">官方合作支付 安全便利</p>
        </div>
      </div>
    </div>
  </div>
  <div class="FormContent">
    <div class="PointBlock">
      <h3 class="Title">請輸入購買資訊</h3>
      <div class="ProdBOX">
        <p class="BlockTitle">購買數量</p>
        <q-option-group :options="ProductList" type="radio" v-model="SelectedProduct" inline />
      </div>
      <div class="ProdBOX">
        <p class="BlockTitle">請選擇付款方式</p>
        <q-option-group :options="PaymentList" type="radio" v-model="PaymentMethod" inline
          @update:model-value="checkPaymentMethod" />
      </div>
      <div class="ProdBOX">
        <p class="BlockTitle">Email</p>
        <div class="form-group">
          <q-input v-model="UserEmail" filled type="email" :rules="emailRules" placeholder="請輸入您的Email" />
          <p id="UserEmailHelp" class="form-text text-negative">此為購點綁定帳號，請務必確認輸入正確</p>
        </div>
      </div>
      <div class="ProdBOX" v-if="ShowInvoice">
        <p class="BlockTitle">發票資訊</p>
        <div class="SelectBOX mb-3">
          <!-- <q-select v-model="InvoiceMethod" :options="InvoiceMethodList" /> -->
          <q-btn-toggle v-model="InvoiceMethod" color="grey" toggle-color="warning" :options="InvoiceMethodList"
            size="15px" no-caps unelevated rounded />
        </div>
        <q-tab-panels class="q-mt-lg" v-model="InvoiceMethod" animated transition-prev="fade" transition-next="fade">
          <q-tab-panel name="inv_personal" class="PayPanel">
            <div id="inv_personal_Content" class="InputBOX invTypeBox inv_personal">
              <q-radio v-model="PersonalInvoiceType" val="手機條碼載具" label="手機條碼載具" />
              <q-radio v-model="PersonalInvoiceType" val="自然人憑證載具" label="自然人憑證載具" />
              <q-radio v-model="PersonalInvoiceType" val="數位鎏會員載具" label="數位鎏會員載具" />
              <div class="input-group" style="padding:10px">
                <q-input v-model="UserEmailCode" outlined :label=PersonalInvoiceType />
              </div>
              <div class="Remarks">
                <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/"
                    target="_blank">財政部電子發票整合服務平台</a></p>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="inv_Triple_Online" class="PayPanel">
            <div class="InputBOX invTypeBox inv_Paper">
              <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入統一編號' style="padding:10px" />
              <q-input v-model="VehicleCode_Citizen" outlined placeholder='請輸入公司名稱' style="padding:10px" />
            </div>
            <div class="Remarks">
              <p class="text_Red">*開立發票後，下載並列印電子發票證明聯(報帳用)，節省發票郵寄時間。</p>
              <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/"
                  target="_blank">財政部電子發票整合服務平台</a></p>
            </div>
          </q-tab-panel>
          <q-tab-panel name="inv_Donate" class="PayPanel">
            <div class="q-pa-md InputBOX invTypeBox inv_Donate">
              <q-option-group :options="InvoiceDonateOptions" type="radio" v-model="InvoiceDonate" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- 這邊加一個驗證碼 -->
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
    <div class="BTNGroup">
      <button type="submit" class="BTN_sure submit" @click="goPayment">前往付款</button>
    </div>
  </div>
  <div class="Notice">
    <div class="NoticeContent">
      <h4 class="Title"><i class="fas fa-exclamation-circle"></i> 付款注意事項</h4>
      <ul class="NoticeList">
        <li>使用線上交易購買商品，請您妥善保存您的交易資料且不得使用虛偽不實之資料進行交易，若因而導致交易糾紛或有犯罪情事者，數位鎏將提供相關資料予檢調單位配合司法調查，請勿以身試法。</li>
        <li>數位鎏已付款或兌換之線上遊戲、服務或商品時，其退貨方式即依該遊戲、服務或商品之相關規範辦理，或請洽詢數位鎏線上客服。</li>
        <li>網路交易請謹慎保護個人資料安全，切勿將您的個人資料外洩。</li>
        <li>若您有付款相關問題，請您透過 數位鎏線上客服 與我們聯絡。</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import Sidentify from "/src/utils/identify.vue"
import { pointApi } from 'boot/axios'
export default {
  name: 'DigiPointComponent',
  components: {
    Sidentify
  },
  data() {
    return {
      emailRules: [
        (value) => !!value || 'Email欄位必填',
        (value) => /.+@.+\..+/.test(value) || '請輸入正確的Email地址'
      ],
      UserEmail: ref(''),
      UserEmailCode: ref(''),
      SelectedProduct: ref(''),
      InvoiceDonate: ref('51811'),
      InvoiceDonateOptions: [
        { label: '第一社會福利基金會', value: '51811' },
        { label: '董氏基金會', value: '531' },
        { label: '中華民國脊髓損傷者聯合會', value: '2628' },
        { label: '關懷台灣文教基金會', value: '9271' }
      ],
      InvoiceMethod: ref('inv_personal'),
      InvoiceMethodList: [
        { label: '個人雲端發票', value: 'inv_personal' },
        { label: '公司發票', value: 'inv_Triple_Online' },
        { label: '發票捐贈', value: 'inv_Donate' }
      ],
      PersonalInvoiceType: ref(''),
      identifyCode: "", //密碼登入圖形驗證碼
      identifyCodes: "23456789abcdefghjkmnpqrstuvwxyz", //生成圖形驗證碼依據
      verify: ""
    }
  },
  methods: {
    goPayment() {
      //const $q = useQuasar()
      //圖形驗證碼
      // if (this.identifyCode != this.verify) {
      //   alert("驗證碼錯誤")
      //   this.refreshIdentifyCode()
      //   this.verify = ""
      //   return;
      // }
      // if (this.UserEmail == "") {
      //   alert("請輸入Email");
      //   return;
      // }
      // if (this.SelectedProduct == "") {
      //   alert("請選購買數量");
      //   return;
      // }
      // if (this.PaymentMethod == "") {
      //   alert("請選擇付款方式");
      //   return;
      // }
      // this.createCookie("User.Email", this.UserEmail, 10);
      // this.createCookie("User.Prodoct", "數位鎏點數 " + this.SelectedProduct + "點", 10);
      // this.createCookie("User.PayAmount", this.SelectedProduct, 10);
      // this.createCookie("User.PaymentMethod", this.PaymentMethod, 10);
      //this.$router.push("/Point/PaymentConfirm");

      let uri = window.location.hash.split('?')[1]
      let params = new URLSearchParams(uri)
      let order = ref()
      let query = {
        "param": {
          "Version": "1.0",
          "MID": params.get("MID"),
          "TID": params.get("TID"),
          "Amount": this.SelectedProduct
        }
      }
      console.log(query);
      pointApi.post('/GenVA', query, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "isCode": 0,
          "apiKey": "87654321876543218765432187654321",
          "type": 0
        }
      })
        .then((response) => {
          //console.log(response.data)
          if (response.data.param.ReturnCode == "000000") {
            //console.log(PaymentList.value)
            console.log(response.data.param)
            this.order = response.data.param.content
            // this.createCookie("User.Email", this.UserEmail, 10);
            // this.createCookie("User.Prodoct", "數位鎏點數 " + this.SelectedProduct + "點", 10);
            // this.createCookie("User.PayAmount", this.SelectedProduct, 10);
            // this.createCookie("User.PaymentMethod", this.PaymentMethod, 10);
            //this.$router.push("/Point/PaymentConfirm");
          }
          else {
            // $q.notify({
            //   type: 'negative',
            //   message: "交易建立失敗 " + response.data.param.ReturnMsg,
            //   position: "center",
            // });
          }
        })
        .catch(function (error) {
          // handle error
          // $q.notify({
          //   type: 'negative',
          //   message: "交易建立失敗 " + error,
          //   position: "center",
          // });
        })

      //this.$router.push("/Point/PaymentDone");
    },
    createCookie(name, value, timeout) {
      var expires;
      if (timeout) {
        var date = new Date();
        date.setTime(date.getTime() + (timeout * 1000));
        expires = "; expires=" + date.toGMTString();
      }
      else {
        expires = "";
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    },
    refreshIdentifyCode() {
      this.identifyCode = "";
      this.makeIdentifyCode(4);
    },
    makeIdentifyCode(l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
  mounted() {
    this.identifyCode = "";
    this.makeIdentifyCode(4);
  },
  setup() {
    const $q = useQuasar()
    const PaymentMethod = ref('')
    const defaultKey = "87654321876543218765432187654321"
    //const MID = "142864983000001"
    //const TID = "F001"
    const ProductList = ref([])
    const PaymentList = ref([])
    const ShowInvoice = ref(false)
    let uri = window.location.hash.split('?')[1]
    //console.log(uri)
    let params = new URLSearchParams(uri)
    const MID = params.get("MID")
    const TID = params.get("TID")
    function getQuery(mid, tid) {
      var query = {
        "param": {
          "Version": "1.0",
          "MID": mid,
          "TID": tid,
        }
      }
      const url = 'https://mp.1qr.tw/api/Product'
      //const url = 'https://localhost:9999/api/Product'
      pointApi.post(url, query, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "isCode": 0,
          "apiKey": defaultKey,
          "type": 0
        }
      })
        .then((response) => {
          //console.log(response.data)
          if (response.data.param.ReturnCode == "000000") {
            if (response.data.param.content.Product.length == 0) {
              $q.notify({
                type: 'warning',
                message: "本遊戲暫無可購買品項",
                position: "center",
              });
            }
            response.data.param.content.Product.forEach(p => {
              ProductList.value.push({ label: p.Name, value: p.ProductID })
            });
            response.data.param.content.Payment.forEach(p => {
              PaymentList.value.push({ label: p.PaymentName, value: p.PaymentID, invoice: p.InvoiceEnable })
            });
            //console.log(PaymentList.value)
          }
          else {
            $q.notify({
              type: 'negative',
              message: "取得購買資訊失敗 " + response.data.param.ReturnMsg,
              position: "center",
            });
          }
        })
        .catch(function (error) {
          // handle error
          $q.notify({
            type: 'negative',
            message: "取得購買資訊失敗 " + error,
            position: "center",
          });
        })
    }
    getQuery(MID, TID);
    function checkPaymentMethod() {
      //console.log(PaymentMethod.value)
      //console.log(PaymentList.value)
      var inv = PaymentList.value.find((p) => p.value == PaymentMethod.value);
      //console.log(inv.invoice)
      ShowInvoice.value = inv.invoice
    }
    return {
      ProductList,
      PaymentList,
      ShowInvoice,
      checkPaymentMethod,
      PaymentMethod
    };
  }
}
</script>
<style lang="sass" scoped>
.BannerBlock
  background-image: url(src/assets/banner/MainBanner.jpg)
.inputGroup
  margin-bottom: 1rem

.VerificationCode
  .Title
    width: 100%
  .refresh
    cursor: pointer
  canvas
    vertical-align: sub
</style>
