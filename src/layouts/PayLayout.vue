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
import HeaderComp from "/src/components/PayHeader.vue"
import FooterComp from "/src/components/PayFooter.vue"

export default {
  name: "PayLayout",
  components: {
    HeaderComp,
    FooterComp
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {};
  }
};
</script>

<style lang="sass" scoped>
.mainContent
  max-width: 1200px
  margin: 0 auto
  padding: 30px 0

</style>
