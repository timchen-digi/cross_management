<template>
  <q-header class="header">
    <q-toolbar class="Toolbar q-pa-md">
      <!-- <img src="~assets/logos/Airwallex-logo.svg" class="mainLOGO" /> -->
      <img src="~assets/logos/DigiFlow_logo.svg" class="mainLOGO" />
    </q-toolbar>
  </q-header>
</template>

<script>

export default {
  name: "HerderComp"
};
</script>

<style lang="sass" scoped>
.header
  background-color: #f7f7f7
  border-bottom: 3px solid #ffb300

  .Toolbar
    max-width: 1200px
    margin: 0 auto

  .mainLOGO
    margin: 0 auto
</style>
