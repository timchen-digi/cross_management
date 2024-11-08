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

import HeaderComp from "/src/components/Header_onlyLogo.vue"
import FooterComp from "/src/components/RegFooter.vue"

export default {
  name: "LoginLayout",
  components: {
    HeaderComp,
    FooterComp
  },
  data() {
    return {};
  },
  setup() {
    return {};
  }
};
</script>

<style lang="sass" scoped>
.mainContent
  margin: 0 auto
  padding: 0

</style>
