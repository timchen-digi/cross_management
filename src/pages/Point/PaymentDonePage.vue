<template>
  <div class="mainContent">
    <div class="Result_Info">
      <div class="Deal_Result">
        <p class="Title">交易成功</p>
        <p class="MainTxt">您已付款成功，請與商家確認是否已支付款項</p>
      </div>
      <div class="User_Info">
        <p>訂單編號：{{ Order.CustomId }}</p>
        <p>付款人Eamil：{{ Order.UserEmail }}</p>
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
import { loadScript } from "vue-plugin-load-script";
export default {
  name: 'DigiPointComponent',
  data() {
    return {
      Order: ref({
        CustomId: "{API回傳}",
        UserEmail: "{API回傳}",
        Prodoct: "{API回傳}",
        Amount: "{API回傳}",
        PayMethod: "{API回傳}",
        PayTime: "{YYYY-MM-DD hh:mm:ss}"
      })
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
    return {
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
