<template>
  <q-layout view="hHh Lpr lFf">
    <HeaderComp />

    <q-page-container>
      <div class="mainContent">
        <router-view />
      </div>
    </q-page-container>

    <FooterComp />
  </q-layout>
</template>

<script>
import { ref } from "vue";
import HeaderComp from "/src/components/Header.vue";
import FooterComp from "/src/components/Footer.vue";

export default {
  name: "MainLayout",
  components: {
    HeaderComp,
    FooterComp,
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      tab: ref("mails"),
    };
  },
};
</script>

<style lang="sass" scoped>
.mainContent
  max-width: 1200px
  margin: 0 auto
  padding: 10px 0
</style>
