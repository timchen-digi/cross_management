<template>
  <div class="BannerBlock">
    <div class="row mainBanner">
      <div class="BannerTitle col-lg-6 col-12">
        <div>
          <h1 class="mainTitle">合作遊戲</h1>
          <p class="subTitle">支援多款遊戲 服務更多元</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mainContent">
    <div class="PointBlock">
      <p class="BlockTitle">遊戲列表</p>
      <div class="ProdBOX">
        <form id="myForm">
          <div class="row justify-content-start">
            <div class="ProdCard col-lg-3 col-sm-6 col-12">
              <div class="ProdImg gameRating R">
                <img src="~assets/Product/GamePic_01.jpg" alt="" class="img-fluid" @click="goGamePage()">
              </div>
              <div class="ProdName">
                <span class="mainTit">APEX LEGENDS</span>
              </div>
              <div class="Prod_Qty">
                <q-btn class="btn full-width" color="primary" @click="goGamePage(prop)">前往官網</q-btn>
                <span> &nbsp;</span>
                <q-btn class="btn full-width">APP下載</q-btn>
              </div>
            </div>
            <div class="ProdCard col-lg-3 col-sm-6 col-12">
              <div class="ProdImg gameRating G">
                <img src="~assets/Product/GamePic_02.jpg" alt="" class="img-fluid">
              </div>
              <div class="ProdName">
                <span class="mainTit">CONQUER POINT CARD</span>
              </div>
              <div class="Prod_Qty">
                <q-btn class="btn full-width" color="primary">前往官網</q-btn>
                <span> &nbsp;</span>
                <q-btn class="btn full-width">APP下載</q-btn>
              </div>
            </div>
            <div class="ProdCard col-lg-3 col-sm-6 col-12">
              <div class="ProdImg gameRating PG12">
                <img src="~assets/Product/GamePic_03.jpg" alt="" class="img-fluid" @click="goGamePage()">
              </div>
              <div class="ProdName">
                <span class="mainTit">Clash of Clans</span>
              </div>
              <div class="Prod_Qty">
                <q-btn class="btn full-width" color="primary">前往官網</q-btn>
                <span> &nbsp;</span>
                <q-btn class="btn full-width">APP下載</q-btn>
              </div>
            </div>
          </div>
        </form>
      </div>
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
    }
  },
  methods: {
    goGamePage(obj) {
      console.log(obj);
      this.$router.push("/Point/Index");
    },
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
.BannerBlock
  background-image: url(src/assets/banner/MainBanner_Game.jpg)
</style>
