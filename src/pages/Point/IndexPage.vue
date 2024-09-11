<template>
  <div class="BannerBlock">
    <div class="row mainBanner">
      <div class="BannerTitle col-lg-6 col-12">
        <div>
          <h1 class="mainTitle">線上付款</h1>
          <p class="subTitle">官方合作支付 安全便利</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mainContent">

    <div class="PointBlock">

      <p class="BlockTitle">選擇要購買的遊戲</p>

      <div class="ProdBOX">
        <form id="myForm">
          <div class="row justify-content-start">
            <a class="ProdCard col-lg-3 col-sm-6 col-12" :href="merchant.herf" v-for="(merchant, index) in merchantItem"
              :key="index">
              <input id="Game_01" type="radio" name="SelectPints" value="Game_01" />
              <span>
                <div class="ProdImg gameRating" :class="merchant.gameRating">
                  <img :src="merchant.PicName" alt="" class="img-fluid">
                </div>
                <div class="ProdName">
                  <span class="mainTit">{{ merchant.Name }}</span>
                </div>
              </span>
            </a>
            <!--
            <a class="ProdCard col-lg-3 col-sm-6 col-12" href="#/Point/DigiPoint">
              <input id="Game_01" type="radio" name="SelectPints" value="Game_01" />
              <span>
                <div class="ProdImg gameRating R">
                  <img src="~assets/Product/GamePic_01.jpg" alt="" class="img-fluid">
                </div>
                <div class="ProdName">
                  <span class="mainTit">APEX LEGENDS</span>
                </div>
              </span>
            </a>

            <a class="ProdCard col-lg-3 col-sm-6 col-12" href="#/Point/DigiPoint">
              <input id="Game_02" type="radio" name="SelectPints" value="Game_02" />
              <span>
                <div class="ProdImg gameRating G">
                  <img src="~assets/Product/GamePic_02.jpg" alt="" class="img-fluid">
                </div>
                <div class="ProdName">
                  <span class="mainTit">CONQUER POINT CARD</span>
                </div>
              </span>
            </a>

            <a class="ProdCard col-lg-3 col-sm-6 col-12" href="#/Point/DigiPoint">
              <input id="Game_03" type="radio" name="SelectPints" value="Game_03" />
              <span>
                <div class="ProdImg gameRating PG12">
                  <img src="~assets/Product/GamePic_03.jpg" alt="" class="img-fluid">
                </div>
                <div class="ProdName">
                  <span class="mainTit">Clash of Clans</span>
                </div>
              </span>
            </a>
            -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { api } from 'boot/axios'
import { ref } from "vue";
import { useQuasar } from 'quasar'
export default {
  name: "PointLayout",
  methods: {
    goHome() {
      this.$router.push("/Point/Index");
    }
  },
  setup() {
    const $q = useQuasar()
    const merchantItem = ref([])
    function getQuery(mid) {
      var query = {
        "param": {
          "Version": "1.0",
          "Merchant": [mid]
        }
      }
      api.post('https://mp.1qr.tw/api/QueryPage', query, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "isCode": 0,
          "apiKey": "87654321876543218765432187654321",
          "type": 0
        }
      })
        .then((response) => {
          //console.log(response.data)
          if (response.data.param.ReturnCode == "000000") {
            merchantItem.value = response.data.param.content.Item
            console.log(merchantItem.value[0])
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
              merchant.herf = "#/Point/DigiPoint?MID=" + merchant.MID + "&TID=" + merchant.TID
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
    getQuery(142864983000001);
    return {
      merchantItem
    };
  }
};
</script>
<style lang="sass" scoped>
.BannerBlock
  background-image: url(src/assets/banner/MainBanner.jpg)
</style>
