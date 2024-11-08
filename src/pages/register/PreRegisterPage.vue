<template>
  <q-banner class="full-width-banner mainbanner">
    <div class="banner-content text-center text-white">
      <h4 class="q-my-sm">數位鎏商戶會員申請</h4>
      <h6 class="q-my-sm">線上填寫，快速審核</h6>
    </div>
  </q-banner>
  <q-page padding>

    <div class="PreContent">
      <div class="q-my-lg">
        <h5 class="MainTitle">商戶資料註冊</h5>
        <RegisterForm />
      </div>
    </div>

  </q-page>
</template>

<script>
import { ref } from "vue";
import RegisterForm from "./component/RegisterForm_Comp.vue"

export default {
  name: "RegisterPage",
  components: {
    RegisterForm
  },
  data() {
    return {

    }
  },
  setup() {
    return {

    }
  }
};

</script>

<style lang="sass">
.mainbanner
  width: 100%
  height: 300px
  background: url('common/mainbanner.jpg')

.PreContent
  max-width: 1000px
  margin: 0 auto

  .MainTitle
    position: relative
    display: flex
    align-items: center
    margin: 0 0 2rem 0
    padding-left: 10px

  .MainTitle:before
    display: inline-block
    content: ""
    width: 4px
    height: 25px
    background: #ffc107
    position: absolute
    left: 0
</style>
