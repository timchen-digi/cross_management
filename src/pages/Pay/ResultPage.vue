<template>
  <q-page>
    <div class="ShopName">
      <q-icon name="storefront" />
      <span>{{ Title }} </span>
    </div>
    <div class="PriceBOX">
      <span>交易結果: {{ Order.OrderStatus }} </span>
    </div>
    <div class="PriceBOX">
      <hr>
      <div>特店名稱: <span class="unit">{{ Order.Store }}</span></div>
      <div>消費者姓名: <span class="unit">{{ Order.Name }}</span></div>
      <div>消費者電話: <span class="unit">{{ Order.Moblie }}</span></div>
      <div>訂單編號: <span class="unit">{{ Order.OrderNo }}</span></div>
      <div>交易金額: <span class="unit">{{ Order.Amount }}</span> 元</div>
      <div>付款方式: <span class="unit">{{ Order.PaymentType }}</span></div>
      <div>卡號末四碼: <span class="unit">{{ Order.CarNo }}</span></div>
      <hr>
    </div>
    <div class="BTNGroup">
      <q-btn color="warning" text-color="black" label="關閉視窗" size="lg" class="q-px-xl" rounded />
    </div>
  </q-page>
</template>
<script>
export default {
  name: "PayResult",
  methods: {},
  components: {
  },
  data() {
  },
  setup() {
    return {
      Title: "%這裡放店家LOGO%",
      Order: {
        Store: "店家名稱",
        Name: "訂購人名稱",
        Moblie: "0988777666",
        OrderNo: "POS.88555462",
        Amount: 5,
        PaymentType: "信用卡",
        CarNo: "2752",
        OrderStatus: "交易成功"
      }
    }
  },
};
</script>
<style lang="sass" scoped>
.PriceBOX
  text-align: center
.PriceBOX div
  font-size:25px
.PriceBOX span
  font-size:25px
  color: green
.ShopName
  padding: 20px 0
  text-align: center
  font-size: 30px
.ShopName i
  color: #FFF
  padding: 12px 10px
  background: #dfa300
  border-radius: 50%
.BTNGroup
  padding: 20px 0
  text-align: center
</style>
