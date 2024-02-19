<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <img src="~assets/logos/DigiFlow_logo_White.svg" class="mainLOGO" />
        <q-space />
        <q-btn
          color="amber"
          text-color="black"
          rounded
          icon-right="send"
          label="登入"
          to="/Login/Index"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <FooterComp />
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import FooterComp from "/src/components/Footer.vue";
export default defineComponent({
  name: "LoginLayout",
  components: { FooterComp },

  setup() {
    const leftDrawerOpen = ref(false);

    return {};
  },
});
</script>
