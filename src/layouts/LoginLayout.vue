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
    <q-footer elevated>
      <q-toolbar class="bg-secondary text-black">
        Digiflow tech. 2024
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
  name: "LoginLayout",
  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {};
  },
});
</script>
