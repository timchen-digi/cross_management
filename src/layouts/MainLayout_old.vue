<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <img src="~assets/digiflow-logo.svg" />

        <q-tabs v-model="tab" shrink>
          <q-route-tab name="home" label="首頁" to="/" />
          <q-route-tab name="pay" label="付款" to="/Pay" />
          <q-route-tab name="wallet" label="錢包" to="/Wallet" />
          <q-route-tab name="history" label="交易紀錄" to="/History" />
        </q-tabs>
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-tabs v-model="tab" shrink>
          <q-tab name="logout" label="登出" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <!-- 側邊選單 -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "首頁",
    caption: "quasar.dev",
    icon: "school",
    link: "/Home",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "/#/Pay",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
