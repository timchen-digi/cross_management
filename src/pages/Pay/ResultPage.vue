<template>
  <div class="PaymentResult">
    <q-img v-if="OrderStatus" src="~/assets/icons/PayState_success.svg" alt="交易成功" class="q-my-md OrderStateImg" />
    <q-img v-if="!OrderStatus" src="~/assets/icons/PayState_failed.svg" alt="交易失敗" class="q-my-md OrderStateImg" />
    <h4 class="text-gray">{{ Title }}</h4>
    <p class="text-h5" :class="OrderStatus ? 'text-green' : 'text-red'">交易結果: {{ OrderStatusText }} </p>
    <q-list separator class="orderList" bordered>
      <q-item v-for="(item, index) in Order" :key="index" clickabled>
        <q-item-section side>
          <q-item-label header>{{ item.Title }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label lines>{{ item.content }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="BTNGroup">
      <q-btn color="warning" class="text-subtitle1 q-px-xl" text-color="black" label="關閉視窗" rounded />
    </div>
  </div>
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
      Title: "%這裡放店家名稱%",
      OrderStatus: true,
      OrderStatusText: "交易成功",
      Order: [
        {
          Title: '特店名稱：',
          content: "店家名稱",
        }, {
          Title: '消費者姓名：',
          content: "訂購人名稱",
        }, {
          Title: '消費者電話：',
          content: "0988777666",
        }, {
          Title: '訂單編號：',
          content: "POS.88555462",
        }, {
          Title: '交易金額：',
          content: "NT$ 5 元",
        }, {
          Title: '付款方式：',
          content: "信用卡",
        }, {
          Title: '卡號末四碼：',
          content: "2752",
        }
      ]
    }
  },
};
</script>
<style lang="sass" scoped>

.PaymentResult
  text-align: center

  .OrderStateImg
    width: 50%
    max-width: 150px

  .orderList
    max-width: 500px
    font-size: 1rem
    margin: 10px auto

.BTNGroup
  padding: 20px 0
  text-align: center

</style>
