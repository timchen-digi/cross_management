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
    <!-- <q-field
              filled
              v-model="price"
              label="Price with v-money directive"
              hint="Mask: $ #,###.00 #"
            >
              <template v-slot:control="{ id, floatingLabel, modelValue, emitValue }">
                <input :id="id" class="q-field__input text-right" :value="modelValue" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
              </template>
</q-field> -->
    <br>
    請選擇合作銀行

    <q-select filled v-model="Bank" :options="['玉山銀行', '彰化銀行', '台北富邦銀行']" />
    <br>
    匯款帳戶資訊 (點擊可複製)
    <br>
    <q-list bordered separator>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label overline>繳款銀行</q-item-label>
          <q-item-label>玉山商業銀行</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label overline>繳款銀行代碼</q-item-label>
          <q-item-label>808</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label overline>繳款帳號</q-item-label>
          <q-item-label>6153840960096125</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label overline>繳款金額</q-item-label>
          <q-item-label>新台幣300元</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple>
        <q-item-section>
          <q-item-label overline>繳款期限</q-item-label>
          <q-item-label>2024-04-02 13:41:04</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <br>
    ※以上繳費方式僅限本次交易使用，逾期無效
    <br>
    <div class="q-pa-md q-gutter-sm">
      <q-btn push color="primary" label="列印繳費資訊" />
    </div>
  </q-card>

  <q-card class="my-card q-py-md q-mb-md q-mx-xl q-pa-md" bordered>
    <h5 class="mainTitle">注意事項</h5>
    商家自訂說明
    <ol>
      <li>商家說明12345</li>
      <li>商家說明ABCDE</li>
      <li>其他疑問請洽客服: service@mail.com</li>
    </ol>
    <hr>
    繳款說明
    <ol>
      <li>跨行轉帳手續費0-15元，由繳款人負擔</li>
      <li>無須將繳款帳號設為常用帳號</li>
      <li>扣款說明XXXXX</li>
    </ol>
    <div class="q-pa-md q-gutter-sm">
      <!-- <q-btn push color="secondary" label="取消訂購" />
    <q-btn push color="primary" label="確認付款" /> -->
    </div>
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
    emailAddress: ref(""),
    PayType: ref('Credit'),
    expM: ref("01"),
    expY: ref("2026"),
    card: ref(null),
    CVV: ref(null),
    Bank: ref("玉山銀行"),
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
  methods: {
    changeName(e) {
      this.valueFields.cardName = e.target.value
      this.$emit('input-card-name', this.valueFields.cardName)
    },
    // changeNumber (e) {
    //   this.valueFields.cardNumber = e.target.value
    //   const value = this.valueFields.cardNumber.replace(/\D/g, '')
    //   // american express, 15 digits
    //   if ((/^3[47]\d{0,13}$/).test(value)) {
    //     this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    //     this.cardNumberMaxLength = 17
    //   } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
    //     this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
    //     this.cardNumberMaxLength = 16
    //   } else if (/^62[0-9]\d*/.test(value)) {
    //     this.valueFields.cardNumber = value.replace(/(\d{6})/, '$1 ').replace(/(\d{6}) (\d{7})/, '$1 $2 ').replace(/(\d{6}) (\d{7}) (\d{6})/, '$1 $2 $3 ').replace(/(\d{5}) (\d{5}) (\d{5}) (\d{4})/, '$1 $2 $3 $4')
    //     this.cardNumberMaxLength = 21
    //   } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
    //     this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
    //     this.cardNumberMaxLength = 19
    //   }
    //   // eslint-disable-next-line
    //   if (e.inputType == 'deleteContentBackward') {
    //     const lastChar = this.valueFields.cardNumber.substring(this.valueFields.cardNumber.length, this.valueFields.cardNumber.length - 1)
    //     // eslint-disable-next-line
    //     if (lastChar == ' ') { this.valueFields.cardNumber = this.valueFields.cardNumber.substring(0, this.valueFields.cardNumber.length - 1) }
    //   }
    //   this.$emit('input-card-number', this.valueFields.cardNumber)
    // },
    changeMonth() {
      this.$emit('input-card-month', this.valueFields.cardMonth)
    },
    changeYear() {
      this.$emit('input-card-year', this.valueFields.cardYear)
    },
    changeCvv(e) {
      this.valueFields.cardCvv = e.target.value
      this.$emit('input-card-cvv', this.valueFields.cardCvv)
    },
    generateMonthValue(n) {
      return n < 10 ? `0${n}` : n
    },
  }
}
</script>

<style lang="sass" scoped>
.paytype-toggle
  border: 1px solid gray
</style>
