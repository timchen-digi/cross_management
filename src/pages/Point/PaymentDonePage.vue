<template>
  <div class="mainContent">
    <div class="Result_Info">
      <div class="Deal_Result">
        <p class="Title">交易成功</p>
        <p class="MainTxt">您已付款成功，請與商家確認是否已支付款項</p>
      </div>
      <div class="User_Info">
        <p>訂單編號：{{ Order.CustomId }}</p>
        <!-- <p>付款人Eamil：{{ Order.UserEmail }}</p> -->
        <p>付款商品：{{ Order.Prodoct }}</p>
        <p>付款金額：{{ Order.Amount }}</p>
        <p>支付方式：{{ Order.PayMethod }}</p>
        <p>付款時間：{{ Order.PayTime }}</p>
      </div>
    </div>
    <div class="BTNGroup">
      <button class="BTN_sure submit" @click="goHome()">返回</button>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import { pointApi } from 'boot/axios'
export default {
  name: 'DigiPointComponent',
  data() {
    return {
    }
  },
  methods: {
    goHome() {
      this.$router.push("/Point/Index");
    }
  },
  mounted() {
  },
  setup() {
    const $q = useQuasar()
    const defaultKey = "87654321876543218765432187654321"
    let uri = window.location.hash.split('?')[1]
    //console.log(uri)
    let params = new URLSearchParams(uri)
    const TransNO = params.get("TransNO")
    const merchantId = "142864983000001"
    const terminalId = "F001"
    const Order = ref({
      CustomId: "{API回傳}",
      //UserEmail: "{API回傳}",
      Prodoct: "{API回傳}",
      Amount: "{API回傳}",
      PayMethod: "{API回傳}",
      PayTime: "{YYYY-MM-DD hh:mm:ss}"
    })
    function getQuery(TransNO) {
      var query = {
        "param": {
          "Version": "1.0",
          "MID": merchantId,
          "TID": terminalId,
          "TransNO": TransNO,
          "Timestamp": "",
          "Sign": ""
        }
      }
      pointApi.post('/Result', query, {
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
            console.log(response.data.param.content)
            Order.value.CustomId = response.data.param.content.CID
            Order.value.PayTime = response.data.param.content.PaymentTime
            // 訂單
            Order.value.Prodoct = response.data.param.content.ExtData
            // 支付方式
            if (response.data.param.content.PaymentInfo) {
              if (response.data.param.content.PaymentInfo.VAccount) {
                Order.value.PayMethod = response.data.param.content.PaymentInfo.VAccount
              }
              if (response.data.param.content.PaymentInfo.BCH) {
                Order.value.PayMethod = response.data.param.content.PaymentInfo.BCH
              }
            }
          }
          else {
            $q.notify({
              type: 'negative',
              message: "取得交易結果失敗 " + response.data.param.ReturnMsg,
              position: "center",
            });
          }
        })
        .catch(function (error) {
          // handle error
          $q.notify({
            type: 'negative',
            message: "取得交易結果失敗 " + error,
            position: "center",
          });
        })
    }
    getQuery(TransNO);
    return {
      Order
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
