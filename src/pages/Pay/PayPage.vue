<template>
  <q-card class="my-card q-py-md q-mb-md q-mx-xl q-pa-md" bordered>
    <h5 class="mainTitle text-center">%商家LOGO%</h5>
    <hr>
    <h5 class="mainTitle">訂單資訊</h5>
    <div class="q-pa-md">
      <q-list bordered separator>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label overline>商品名稱</q-item-label>
            <q-item-label>MyCard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label overline>訂單編號</q-item-label>
            <q-item-label>240401120954</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label overline>商品說明</q-item-label>
            <q-item-label>商品說明文字商品說明文字商品說明文字</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-ripple>
          <q-item-section>
            <q-item-label overline>支付金額</q-item-label>
            <q-item-label>300元</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
  <q-card class="my-card q-py-md q-mb-md q-mx-xl q-pa-md" bordered>
    <h5 class="mainTitle">扣款資訊</h5>
    繳費方式
    <br>
    <q-btn-toggle v-model="PayType" class="paytype-toggle" rounded :options="[
      { label: '信用卡', value: 'Credit' },
      { label: '銀行帳戶', value: 'Bank' },
      { label: '其他(未來可新增..)', value: 'Other' },
    ]" />
    <br>
    <br>
    信用卡卡號
    <div class="q-gutter-md items-start">
      信用卡欄位應有自動完成
      <q-input filled v-model="CardNumber" mask="#### - #### - #### - ####" fill-mask=" " name="cardnumber"
        autocomplete="cc-number" />
    </div>
    <br>
    信用卡背面末三碼
    <q-input outlined filled :rules="[val => val.length <= 3 || '請輸入末三碼']" v-model="CVV" label="請輸入末三碼" hint=""
      name="cvc" autocomplete="cc-csc" />
    到期日(月/年)
    <div class="q-gutter-md row">
      <q-select filled v-model="expM" :options="[
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
    ]" name="ccmonth" autocomplete="cc-exp-month" />
      <q-select filled v-model="expY" :options="[
      '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'
    ]" name="ccyear" autocomplete="cc-exp-year" />
    </div>

    <!-- <q-input outlined v-model="searchUserByPay" label="到期日" hint="※請填入正確E-mail，往後自動定期扣款完成通知將會寄到您的信箱，以利訂戶查詢" /> -->
    <br>
    Email
    <q-input outlined filled :rules="[val => !!val || '本欄位必填']" type="email" v-model="emailAddress" label="請輸入電子郵件"
      name="email" autocomplete="email" />
    手機號碼
    <div class="q-gutter-md row items-start">
      <q-select filled v-model="phonePrefix" :options="[
      '+886', '+86', '+852', '+1'
    ]" />
      <q-input outlined filled v-model="phoneNumber" label="請輸入手機號碼" type="tel" />
    </div>
    <br>
    <q-checkbox v-model="agreeSubscribe" label="同意每月自動扣款" required />
    <div class="q-pa-md q-gutter-sm">
      <q-btn push color="secondary" label="清除重填" />
      <q-btn push color="primary" label="確認付款" />
    </div>
  </q-card>

  <q-card class="my-card q-py-md q-mb-md q-mx-xl q-pa-md" bordered>
    <h5 class="mainTitle">注意事項</h5>
    商家自訂說明
    <ol>
      <li>商家說明12345</li>
      <li>商家說明ABCDE</li>
      <li>若您要取消自動扣款，請聯絡本店客服</li>
      <li>其他疑問請洽客服: service@mail.com</li>
    </ol>
    <hr>
    扣款說明
    <ol>
      <li>您同意系統於每月自動扣款OO元</li>
      <li>扣款說明XXXXX</li>
    </ol>

  </q-card>
  <br>

</template>

<script>
import { ref } from "vue";
import { VuePaycard } from "vue-paycard";

export default {
  name: 'PayComponent',
  //components: { VuePaycard },
  directives: {
    'number-only': {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      }
    },
    'letter-only': {
      bind(el) {
        function checkValue(event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      }
    }
  },
  data: () => ({
    minCardYear: new Date().getFullYear(),
    cardNumber: ref(null),
    phoneNumber: ref(""),
    phonePrefix: ref("+886"),
    emailAddress: ref(""),
    PayType: ref('Credit'),
    expM: ref("01"),
    expY: ref("2026"),
    card: ref(null),
    CVV: ref(null),
    agreeSubscribe: ref(false),
  }),
  computed: {
    minCardMonth() {
      if (this.valueFields.cardYear === this.minCardYear) return new Date().getMonth() + 1
      return 1
    }
  },
  watch: {
    cardYear() {
      if (this.valueFields.cardMonth < this.minCardMonth) {
        this.valueFields.cardMonth = ''
      }
    }
  },
  setup() {
    return {

    }
  },
}
</script>

<style lang="sass" scoped>
.paytype-toggle
  border: 1px solid gray
</style>
