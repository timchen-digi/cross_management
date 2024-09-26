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
            <div class="ProdCard col-lg-3 col-sm-6 col-12" v-for="(merchant, index) in merchantItem" :key="index">
              <div class="ProdImg gameRating" :class="merchant.gameRating">
                <img :src="merchant.PicName" alt="" class="img-fluid" @click="goGamePage(merchant.OfficialURL)">
              </div>
              <div class="ProdName">
                <span class="mainTit">{{ merchant.Name }}</span>
              </div>
              <div class="Prod_Qty">
                <q-btn class="btn full-width" color="primary" @click="goGamePage(merchant.OfficialURL)">前往官網</q-btn>
                <span> &nbsp;</span>
                <q-btn class="btn full-width" @click="goGamePage(merchant.AppURL)">APP下載</q-btn>
              </div>
            </div>
            <!---->
            <!--
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
             -->

          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from 'quasar'
import { pointApi } from 'boot/axios'
export default {
  name: 'GameListComponent',
  data() {
    return {
    }
  },
  methods: {
    goGamePage(url) {
      console.log(url);
      window.open(url, '_blank').focus();
      //this.$router.push("/Point/Index");
    },
    goHome() {
      this.$router.push("/Point/Index");
    }
  },
  mounted() {

  },
  setup() {
    const $q = useQuasar()
    const merchantItem = ref([])
    const defaultKey = "87654321876543218765432187654321"
    const merchantId = 332715810000001
    function getQuery(mid) {
      var query = {
        "param": {
          "Version": "1.0",
          "Merchant": [mid]
        }
      }
      pointApi.post('/QueryPage', query, {
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
            merchantItem.value = response.data.param.content.Item
            //console.log(merchantItem.value[0])
            merchantItem.value.forEach(merchant => {
              if (merchant.Rating == 1) {
                merchant.gameRating = "G"
              }
              else if (merchant.Rating == 2) {
                merchant.gameRating = "P"
              }
              if (merchant.Rating == 3) {
                merchant.gameRating = "PG12"
              }
              if (merchant.Rating == 4) {
                merchant.gameRating = "PG15"
              }
              if (merchant.Rating == 5) {
                merchant.gameRating = "R"
              }
              if (!merchant.PicName) {
                merchant.PicName = "product/default.webp"
              }
              else {
                merchant.PicName = "product/" + merchant.PicName
              }
            });
          }
          else {
            $q.notify({
              type: 'negative',
              message: "取得遊戲列表失敗 " + response.data.param.ReturnMsg,
              position: "center",
            });
          }
        })
        .catch(function (error) {
          // handle error
          $q.notify({
            type: 'negative',
            message: "取得遊戲列表失敗 " + error,
            position: "center",
          });
        })
    }
    getQuery(merchantId);
    return {
      merchantItem
    };
  }
}
</script>
<style lang="sass" scoped>
.BannerBlock
  background-image: url(src/assets/banner/MainBanner_Game.jpg)
</style>
