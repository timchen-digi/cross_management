<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <img src="~assets/digiflow-logo.svg" />
        <q-tabs v-model="tab" shrink>
          <!-- <q-route-tab name="home" label="首頁" to="/Home" /> -->
          <q-route-tab name="merchant" label="商戶管理" to="/Merchant" />
          <q-route-tab name="pay" label="付款" to="/Pay" />
          <q-route-tab name="wallet" label="錢包" to="/Wallet" />
          <q-route-tab name="history" label="交易紀錄" to="/History" />
        </q-tabs>
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-tabs v-model="tab" shrink>
          <q-route-tab name="logout" label="登出" to="/Login/Index" />
        </q-tabs>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-toolbar class="bg-secondary text-black">
        <img src="~assets/digiflow-logo.svg" />
        <q-space />
        <q-tabs shrink>
          <q-tab name="contact" label="聯絡我們" to="/" />
          <q-tab name="qa" label="常見問題" to="/" />
          <q-tab name="privacy" label="隱私權聲明" to="/" />
          <q-tab name="privacy" label="Cookie" to="/" />
          <q-tab name="privacy" label="法律同意書" to="/" />
        </q-tabs>
      </q-toolbar>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "MainLayout",
  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {};
  },
});
</script>
