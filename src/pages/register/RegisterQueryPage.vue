<template>
  <q-banner class="full-width-banner mainbanner">
    <div class="banner-content text-center text-white">
      <h4 class="q-my-sm">數位鎏商戶申請進度查詢</h4>
    </div>
  </q-banner>
  <q-page padding>
    <div class="PreContent">
      <q-stepper v-model="step" ref="stepper" alternative-labels color="primary" flat>
        <q-step :name="1" title="送件完成" caption="資料審核中" icon="manage_search">
          <div class="progressInfo">
            <h5 class="MainTitle">註冊進度資訊</h5>
            <p>已送件完成，資料審查中...</p>
          </div>
        </q-step>
        <q-step :name="2" title="審核資料" caption="待修改" icon="settings">
          <div class="progressInfo">
            <h5 class="MainTitle">註冊進度資訊</h5>
            <p>已送件完成，缺少部分資料，等待資料補件中...</p>
          </div>
        </q-step>
        <q-step :name="3" title="審核完成" icon="create_new_folder">
          <div class="progressInfo">
            <h5 class="MainTitle">註冊進度資訊</h5>
            <p>資料審查完成，請將下列申請商戶相關紙本文件寄送到數位鎏，以便完成建立商戶資料手續。</p>
            <ul style="">
              <li>紙本合約</li>
              <li>營登資料 影本</li>
              <li>負責人資料 影本</li>
            </ul>
            <p>送件地址：台北市中山區民權東路二段42號6樓 電子商務部 收</p>
          </div>
        </q-step>
        <q-step :name="4" title="完成註冊" icon="verified">
          <div class="progressInfo">
            <h5 class="MainTitle">註冊進度資訊</h5>
            <p>恭喜您已成為數為鎏企業商戶，即刻開始您的線上支付吧！</p>
          </div>
        </q-step>
      </q-stepper>


      <div class="q-my-lg">
        <div v-if="step == 2">
          <h5 class="MainTitle">資料更新</h5>
          <RegisterForm />
        </div>
      </div>

    </div>


  </q-page>
</template>

<script>

import { ref } from "vue";
import RegisterForm from "./component/RegisterForm_Comp.vue"

export default {
  name: "CheckRegisterPage",
  components: {
    RegisterForm
  },
  data() {
    return {
    }
  },
  setup() {
    return {
      step: ref(2)
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

  .progressInfo
    width: 100%
    background: #e5e5e5
    padding: 1rem

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

  .inputContent
    margin: 30px 0

    .inputGroup
      margin-bottom: 1rem

</style>
