<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="header">
      <div class="menuNAV">
        <q-toolbar class="Toolbar bg-white text-black rounded-borders">
          <img class="logo" src="~assets/logos/DigiFlow_logo.svg" @click="goHome()" />
          <q-space />
          <q-tabs v-model="tab" shrink>
            <q-route-tab name="home" label="線上付款" to="/Point/" />
            <q-route-tab name="GameList" label="合作遊戲" to="/Point/GameList" />
            <q-route-tab name="QA" label="常見問題" to="/Point/QA" />
            <q-route-tab name="Contact" label="線上客服" to="/Point/Contact" />
          </q-tabs>
        </q-toolbar>
      </div>
    </q-header>
    <q-page-container style="padding-top: 0px;">
      <div class=" mainContent" style="margin-top: 0px;">
        <router-view />
      </div>
    </q-page-container>
    <div class="footer row justify-content-center align-items-center">
      <div class="InfoBOX_L col-lg-6 col-sm-12 col-12 row">
        <div class="CommunityBOX">
          <div class="LOGO"><img src="~assets/common/mainLOGO.svg" class="img-fluid"></div>
          <!-- <div class="CommunityBTN">
            <img src="~assets/common/CommunityBTN_FB.svg" class="img-fluid" @click="goHome()">
            <img src="~assets/common/CommunityBTN_IG.svg" class="img-fluid" @click="goHome()">
            <img src="~assets/common/CommunityBTN_YT.svg" class="img-fluid" @click="goHome()">
            <img src="~assets/common/CommunityBTN_LINE.svg" class="img-fluid" @click="goHome()">
          </div> -->
        </div>
        <div class="CompInfo">
          <ul>
            <li><i class="fas fa-map-pin"></i> 台北市 中山區民權東路二段42號6樓</li>
            <li><i class="far fa-clock"></i> 09:00AM - 18:00PM</li>
            <li><i class="fas fa-phone"></i> 02-7728-9155</li>
            <li><i class="far fa-envelope-open"></i> cs@digiflowtech.com</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">
      <q-tabs shrink>
        <q-route-tab name="About" label="關於我們" to="/Point/About" />
        <q-route-tab name="Privacy" label="個人資料暨隱私權保護政策" to="/Point/Privacy" />
        <q-route-tab name="Agree" label="線上購買同意書" to="/Point/Agree" />
      </q-tabs>
      <span>© Copyright 2024 | 數位鎏版權所有 | All Rights Reserved</span>
    </div>
  </q-layout>
</template>
<script>
import { ref } from "vue";
export default {
  name: "PointLayout",
  methods: {
    goHome() {
      this.$router.push("/Point/Index");
    }
  },
  setup() {
    return {};
  }

};
</script>
<style lang="scss">
@import "src/css/point.scss";
</style>
