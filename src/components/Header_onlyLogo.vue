<template>
  <q-header elevated class="header">
    <q-toolbar class="Toolbar text-white justify-center">
      <img src="~assets/logos/DigiFlow_logo_White.svg" class="mainLOGO" />
    </q-toolbar>
  </q-header>
</template>

<script>
import { ref } from "vue";

export default {
  name: "OnlyLogoHerderComp",
  components: {
  },
  data() {
    return {}
  },
  setup() {
    return {}
  },
};
</script>

<style lang="sass" scoped>
.header
  .Toolbar
    max-width: 1200px
    margin: 0 auto
    .tabs
      .q-tab
        padding: 20px 15px

  .mainLOGO
    margin-right: 25px

.notifyContent
  max-width: 250px
.my-menu-link
  color: white
  background: #F2C037

@media screen and (max-width: 576px)
  .mainLOGO
    display: none

</style>
