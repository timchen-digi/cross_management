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
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.BannerBlock
  background-image: url(src/assets/banner/MainBanner.jpg)
</style>
