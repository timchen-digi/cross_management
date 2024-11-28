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
      <q-btn color="warning" class="text-subtitle1 q-px-xl" text-color="black" label="關閉視窗" rounded
        onclick="window.close()" />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import { loadScript } from "vue-plugin-load-script";
import { pointApi } from 'boot/axios'
import Swal from 'sweetalert2'
export default {
  name: "PayResult",
  methods: {},
  components: {
  },
  data() {
  },
  setup() {
    let uri = window.location.hash.split('?')[1]
    let params = new URLSearchParams(uri)
    // MID = params.get("MID")
    let MID = '332715810000001'
    let TID = 'Game02'
    let query = {
      "param": {
        "Version": "1.0",
        "MID": MID,
        "TID": TID,
        "TransNO": params.get("TransNO"),
        "Timestamp": new Date().getTime()
      }
    }
    let Order = [
      {
        Title: '特店名稱：',
        content: "店家名稱",
      }, {
        Title: '訂單編號：',
        content: params.get("TransNO"),
      }, {
        Title: '交易金額：',
        content: "NT$ 30 元",
      }, {
        Title: '付款方式：',
        content: "信用卡",
      }, {
        Title: '卡號末四碼：',
        content: "1007",
      }
    ]
    pointApi.post('/Result', query, {
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
          console.log(response.data.param)
          this.order = response.data.param.content
          Swal.fire(this.order);
        }
        else {
          alert("查詢失敗，錯誤代碼" + response.data.param.ReturnCode)
          $q.notify({
            type: 'negative',
            message: response.data.param.ReturnMsg,
            position: "center",
          });
        }
      })
      .catch(function (error) {
        console.log("查詢失敗")
      })
    return {
      Title: "數位鎏線上付款",
      OrderStatus: true,
      OrderStatusText: "交易成功",
      Order
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
