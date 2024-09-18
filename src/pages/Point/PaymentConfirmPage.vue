<template>
  <div class="mainContent">
    <div class="Result_Info">
      <div class="Deal_Result">
        <p class="Title">確認訂單內容</p>
        <p class="MainTxt">請再次確認訂單內容，下一步將轉往金流結帳頁面</p>
      </div>
      <div class="User_Info">
        <p>付款人Eamil：{{ Order.UserEmail }}</p>
        <p>付款商品：{{ Order.Prodoct }}</p>
        <p>付款金額：{{ Order.Amount }} 元</p>
        <p>支付方式：{{ Order.PayMethod }}</p>
      </div>
    </div>
    <div class="BTNGroup">
      <button class="BTN_cancel" @click="cancelPayment">返回</button>
      <button class="BTN_sure submit" @click="goPayment">確認付款</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DigiPointComponent',
  data() {
    return {
    }
  },
  methods: {
    cancelPayment() {
      this.$router.push("/Point/DigiPoint");
    },
    goPayment() {
      alert("跳轉至對應支付頁面");
      this.$router.push("/Point/PaymentDone");
    }
  },
  mounted() {
  },
  setup() {
    function getCookieValue(name) {
      const regex = new RegExp(`(^| )${name}=([^;]+)`)
      const match = document.cookie.match(regex)
      if (match) {
        return match[2]
      }
    }
    const Order = {
      UserEmail: getCookieValue("User.Email"),
      Prodoct: getCookieValue("User.Prodoct"),
      Amount: getCookieValue("User.PayAmount"),
      PayMethod: getCookieValue("User.PaymentMethod")
    }
    return {
      Order
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
