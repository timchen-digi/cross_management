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
        <p class="BlockTitle">請選擇遊戲伺服器</p>
        <div class="form-group">
          <q-select v-model="myServer" :options="ServerOptions" outlined rounded disabled />
          <!-- <q-input v-model="myMail" filled placeholder="綁定帳號後自動填入" /> -->
          <p id="UserEmailHelp" class="form-text text-negative">購買商品將發送至您選擇的伺服器</p>
        </div>
      </div>
      <div class="ProdBOX">
        <p class="BlockTitle">購買項目</p>
        <q-option-group :options="ProductList" type="radio" v-model="SelectedProduct" inline
          @update:model-value="checkSelectedProduct" />
      </div>
      <div class="ProdBOX">
        <p class="BlockTitle">請選擇付款方式</p>
        <q-option-group :options="PaymentList" type="radio" v-model="PaymentMethod" inline
          @update:model-value="checkPaymentMethod" />
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
              <q-radio v-model="CarrierType" val="手機條碼載具" label="手機條碼載具" />
              <q-radio v-model="CarrierType" val="自然人憑證載具" label="自然人憑證載具" />
              <q-radio v-model="CarrierType" val="數位鎏會員載具" label="數位鎏會員載具" />
              <div class="input-group" style="padding:10px">
                <q-input v-model="CarrierNO" outlined :label=CarrierType />
              </div>
              <div class="Remarks">
                <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/"
                    target="_blank">財政部電子發票整合服務平台</a></p>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="inv_Triple_Online" class="PayPanel">
            <div class="InputBOX invTypeBox inv_Paper">
              <q-input v-model="BuyerID" outlined placeholder='請輸入統一編號' style="padding:10px" />
              <q-input v-model="BuyerName" outlined placeholder='請輸入公司名稱' style="padding:10px" />
            </div>
            <div class="Remarks">
              <p class="text_Red">*開立發票後，下載並列印電子發票證明聯(報帳用)，節省發票郵寄時間。</p>
              <p>※依法規定，發票一經開立，不得更改或該開其他統一編號發票。<a href="https://www.einvoice.nat.gov.tw/"
                  target="_blank">財政部電子發票整合服務平台</a></p>
            </div>
          </q-tab-panel>
          <q-tab-panel name="inv_Donate" class="PayPanel">
            <div class="q-pa-md InputBOX invTypeBox inv_Donate">
              <q-option-group :options="InvoiceDonateOptions" type="radio" v-model="LoveCode" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div class="ProdBOX">
        <p class="BlockTitle">Email</p>
        <div class="form-group">
          <q-input v-model="UserEmail" filled type="email" :rules="emailRules" placeholder="請輸入您的Email" />
          <!-- <p id="UserEmailHelp" class="form-text text-negative">此為購買綁定帳號，請務必確認輸入正確</p> -->
        </div>
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
  <q-dialog v-model="needAuth" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">➤請先登入</div>
        <p class="BlockTitle">請選擇欲綁定帳號</p>
        <div class="BTNGroup" style="margin: 0%">
          <button type="submit" class="BTN_sure submit" @click="facebookLogin" style="width:90%; margin: 2%"><q-icon
              name="facebook" />&nbsp;
            使用Facebook帳號登入</button>
          <button class="BTN_cancel submit" onclick="alert('Google帳號登入功能開發中')" style="width:90%; margin: 2%">
            使用Google帳號登入</button>
          <br>
          <button class="BTN_cancel submit" onclick="alert('LINE帳號登入功能開發中')" style="width:90%; margin: 2%">
            使用LINE帳號登入</button>
          <button class="BTN_cancel submit" @click="skipAuth" style="width:90%; margin: 2%">
            *[測試]跳過登入步驟*</button>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
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
  created() {

  },
  data() {
    return {
      emailRules: [
        (value) => !!value || 'Email欄位必填',
        (value) => /.+@.+\..+/.test(value) || '請輸入正確的Email地址'
      ],
      UserEmail: ref(''),
      CarrierNO: ref(''),
      LoveCode: ref('51811'),
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
      CarrierType: ref('手機條碼載具'),
      BuyerID: ref(''),
      BuyerName: ref(''),
      identifyCode: "", //密碼登入圖形驗證碼
      //myMail: "mail",
      identifyCodes: "23456789abcdefghjkmnpqrstuvwxyz", //生成圖形驗證碼依據
      verify: ""
    }
  },
  methods: {
    goPayment() {
      //const $q = useQuasar()
      // 圖形驗證碼
      if (this.identifyCode != this.verify) {
        alert("驗證碼錯誤")
        this.refreshIdentifyCode()
        this.verify = ""
        return;
      }
      if (this.UserEmail == "") {
        alert("請輸入Email");
        return;
      }
      if (this.PaymentMethod == "") {
        alert("請選擇付款方式");
        return;
      }
      if (typeof (this.SelectedProduct) != typeof (1)) {
        alert("請選擇購買品項");
        return;
      }
      let uri = window.location.hash.split('?')[1]
      let params = new URLSearchParams(uri)
      let order = ref()
      let terminalName = ""
      if (params.get("TID") == "Game02") {
        terminalName = "Mobile Legend"
      }
      if (params.get("TID") == "Game09") {
        terminalName = "長安養成記"
      }
      // Amount : this.Amount
      let query = {
        "param": {
          "Version": "1.0",
          "MID": params.get("MID"),
          "TID": params.get("TID"),
          "InvoiceType": 0,
          "Amount": this.SelectedProduct,
          "Email": this.UserEmail
        }
      }
      // 發票資訊
      let CarrierInfo = {}
      if (this.ShowInvoice) {
        if (this.InvoiceMethod == "inv_personal") {
          // 個人發票載具
          CarrierInfo.InvoiceType = 1
          if (this.CarrierType == "手機條碼載具") {
            CarrierInfo.CarrierType = 1
          }
          if (this.CarrierType == "自然人憑證載具") {
            CarrierInfo.CarrierType = 2
          }
          if (this.CarrierType == "數位鎏會員載具") {
            CarrierInfo.CarrierType = 3
          }
          CarrierInfo.CarrierNO = this.CarrierNO
        } else if (this.InvoiceMethod == "inv_Triple_Online") {
          // 公司發票
          CarrierInfo.InvoiceType = 3
          CarrierInfo.BuyerID = this.BuyerID
          CarrierInfo.BuyerName = this.BuyerName
        } else if (this.InvoiceMethod == "inv_Donate") {
          // 發票捐贈
          CarrierInfo.InvoiceType = 2
          CarrierInfo.LoveCode = this.LoveCode
        } else {
          // 未選擇發票類型
        }
        Object.keys(CarrierInfo).forEach(function (item) {
          query.param[item] = CarrierInfo[item];
        });
      }
      if (query.param.Amount == null) {
        alert("未選擇購買項目")
        return
      }
      if (query.param.InvoiceType == null || query.param.CarrierType == null) {
        // 未選擇發票
      }
      console.log(query);
      // 虛擬帳號
      if (this.PaymentMethod == 1) {
        pointApi.post('/GenVA', query, {
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
              //console.log(response.data.param)
              this.order = response.data.param.content
              var ProductName = this.ProductList.find((p) => p.value == this.SelectedProduct);
              // 商品名稱
              this.createCookie("User.Prodoct", ProductName.label.split(' ')[0], 10);
              // 遊戲名稱
              this.createCookie("User.Terminal", terminalName, 10);
              this.$router.push("/Pay/Bank?O=" + this.order.OrderNO + "&P=" + this.order.Amount + "&A=" + this.order.VirtualAccount + "&T=" + this.order.ExpiryTime);
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
            // handle error
            // $q.notify({
            //   type: 'negative',
            //   message: "交易建立失敗 " + error,
            //   position: "center",
            // });
          })
      }
      //信用卡
      else if (this.PaymentMethod == 4) {
        // 導向信用卡頁面
        var ProductName = this.ProductList.find((p) => p.value == this.SelectedProduct);
        // 商品名稱
        if (this.ShowInvoice) {
          console.log("需開立發票")
          this.createCookie("Carrier", true, 10);
          this.createCookie("Carrier.Info", JSON.stringify(CarrierInfo), 10);
        }
        this.createCookie("User.Prodoct", ProductName.label.split(' ')[0], 10);
        this.createCookie("User.Email", this.UserEmail, 10);
        // 待改，帶入遊戲名稱
        console.log(terminalName)
        this.createCookie("User.Terminal", terminalName, 10);
        this.$router.push("/Pay/Creditcard?&P=" + this.SelectedProduct + "&M=" + params.get("MID") + "&E=" + params.get("TID"));
      } else {
        // 開發中
        alert("佔不支援此支付方式")
        return
      }
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
    //this.myMail = "";
    this.makeIdentifyCode(4);
    //console.log("渲染完成後檢查FB登入")
    //this.facebookLogin();
  },
  setup() {
    const $q = useQuasar()
    const PaymentMethod = ref('')
    const defaultKey = "87654321876543218765432187654321"
    //const MID = "142864983000001"
    //const TID = "F001"
    const ProductList = ref([])
    const SelectedProduct = ref(ProductList.value[0])
    const PaymentList = ref([])
    const ShowInvoice = ref(false)
    const needAuth = ref(true)
    // 測試期間略過登入
    //needAuth.value = false

    // 防止重複載入
    if (!window.FB) {
      window.fbAsyncInit = function () {
        FB.init({
          appId: '1090788265529869',
          cookie: true,
          xfbml: true,
          version: 'v21.0'
        });

        //do something after init
        // console.log("渲染完成後檢查FB登入")
        // facebookLogin();
      };
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
    let uri = window.location.hash.split('?')[1]
    //console.log(uri)
    let params = new URLSearchParams(uri)
    const MID = params.get("MID")
    const TID = params.get("TID")
    function getQuery(mid, tid) {
      if (mid == null || tid == null) {
        alert("請重新選擇商品")
        this.$router.push("/Point/Index");
        return
      }
      var query = {
        "param": {
          "Version": "1.0",
          "MID": mid,
          "TID": tid,
        }
      }
      pointApi.post('/Product', query, {
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
              ProductList.value.push({ label: p.Name + " NT$" + p.Amount, value: p.Amount })
            });
            response.data.param.content.Payment.forEach(p => {
              // console.log(p)
              if (p.PaymentID == 1) {
                // 若是銀行虛擬帳號，不顯示銀行名稱以免混淆
                PaymentList.value.push({ label: "虛擬帳號", value: p.PaymentID, invoice: p.InvoiceEnable })
              }
              else {
                PaymentList.value.push({ label: p.PaymentName, value: p.PaymentID, invoice: p.InvoiceEnable })
              }
              if (p.InvoiceEnable == true) {

              }
            });
            SelectedProduct.value = ProductList.value[0]
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
    function checkSelectedProduct() {
      //console.log(SelectedProduct.value);
    }
    const myServer = ref("綁定帳號後自動填入");
    const ServerOptions = ref([
      { label: '綁定帳號後自動填入', value: '' }
    ])
    function facebookLogin() {
      // 檢查登入狀態
      FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          console.log("已登入")
          getProfile();
          needAuth.value = false;
        } else {
          console.log("未登入")
          FB.login(
            function (res) {
              console.log("呼叫登入");
              getProfile();
            },
            { scope: "public_profile,email" }
          );
        }
      });
    }
    function getProfile() {
      console.log("getProfile");
      const myId = ref("");
      FB.api("/me?fields=name,id,email", function (res) {
        // do something
        console.log(res);
        if (res.id == null || res.id == undefined) {
          alert("登入失敗")
          needAuth.value = true;
        }
        else {
          //alert("[開發]已連結FB帳號，uid:" + res.id)
          console.log(res.email)
          myId.value = res.id
          needAuth.value = false;
          //this.myMail = res.email;
        }
        //alert(myId.value);
        myServer.value = "伺服器-" + myId.value;
        ServerOptions.value = [{ label: myServer.value, value: myServer.value }]
        //alert(myMail)
      });
    }
    return {
      ProductList,
      SelectedProduct,
      PaymentList,
      ShowInvoice,
      checkPaymentMethod,
      PaymentMethod,
      checkSelectedProduct,
      facebookLogin,
      myServer,
      needAuth,
      ServerOptions,
      skipAuth: function () {
        // Under dev mode
        needAuth.value = false
        myServer.value = "伺服器-test01"
        ServerOptions.value = [{ label: myServer.value, value: myServer.value }]
      }
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
